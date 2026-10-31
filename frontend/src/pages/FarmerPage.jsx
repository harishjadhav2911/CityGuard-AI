import React, { useState, useEffect } from 'react';
import {
  Droplets,
  FileText,
  MapPin,
  PlusCircle,
  Upload,
  Clock,
  Send
} from 'lucide-react';
import { api } from '../services/api';

export default function FarmerPage({ showToast }) {
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('Nagpur');
  const [selectedTaluka, setSelectedTaluka] = useState('Hingna');
  const [intel, setIntel] = useState(null);
  const [farmerReports, setFarmerReports] = useState([]);
  const [activeTab, setActiveTab] = useState('report-form'); // 'report-form', 'tracking', 'schemes', 'advisories'

  // Form states
  const [farmerName, setFarmerName] = useState('');
  const [villageName, setVillageName] = useState('');
  const [reportCategory, setReportCategory] = useState('Crop Damage & Inundation');
  const [cropType, setCropType] = useState('Nagpur Santra (Orange)');
  const [acreage, setAcreage] = useState('3.0');
  const [description, setDescription] = useState('');
  const [uploadedPhoto, setUploadedPhoto] = useState(null);

  // Fetch districts
  useEffect(() => {
    const loadDistricts = async () => {
      try {
        const data = await api.getFarmerDistricts();
        setDistricts(data || []);
        if (data?.length > 0) {
          setSelectedDistrict(data[0].name);
          setSelectedTaluka(data[0].talukas?.[0] || 'Hingna');
        }
      } catch {
        // Fallback
      }
    };
    loadDistricts();
  }, []);

  // Fetch intelligence & farmer reports
  useEffect(() => {
    const loadIntelligence = async () => {
      try {
        const [intelData, reportsData] = await Promise.all([
          api.getFarmerIntelligence(selectedDistrict, selectedTaluka),
          api.getFarmerReports()
        ]);
        setIntel(intelData);
        setFarmerReports(reportsData || []);
      } catch {
        // Fallback
      }
    };
    if (selectedDistrict) {
      loadIntelligence();
    }
  }, [selectedDistrict, selectedTaluka]);

  const currentDistObj = districts.find((d) => d.name === selectedDistrict);

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedPhoto(file.name);
      if (showToast) showToast(`Field photo attached: ${file.name}`, 'info');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!farmerName || !villageName || !description) {
      if (showToast) showToast('Please complete required fields', 'error');
      return;
    }

    try {
      const created = await api.createFarmerReport({
        farmerName,
        district: selectedDistrict,
        taluka: selectedTaluka,
        village: villageName,
        category: reportCategory,
        crop: cropType,
        acreageAffected: parseFloat(acreage),
        description,
        photoName: uploadedPhoto
      });

      if (showToast) {
        showToast(
          `Grievance ${created.id} submitted for ${farmerName}. PMFBY 72h window logged.`,
          'success',
          'Farmer Grievance Registered'
        );
      }

      setFarmerName('');
      setVillageName('');
      setDescription('');
      setUploadedPhoto(null);
      const updatedReports = await api.getFarmerReports();
      setFarmerReports(updatedReports || []);
      setActiveTab('tracking');
    } catch {
      if (showToast) showToast('Failed to register farmer grievance', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
                Maharashtra Farmer Protection & Grievance Portal
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                STATEWIDE ADVISORY
              </span>
            </div>
            <p className="text-gray-500 text-xs md:text-sm mt-1">
              Crop damage intimation, water shortage reporting, PMFBY 72-hour compensation assistance, and scheme tracking.
            </p>
          </div>

          {/* District & Taluka Selectors */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-300 text-xs">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <select
                value={selectedDistrict}
                onChange={(e) => {
                  const dName = e.target.value;
                  setSelectedDistrict(dName);
                  const dObj = districts.find((x) => x.name === dName);
                  if (dObj && dObj.talukas?.length > 0) {
                    setSelectedTaluka(dObj.talukas[0]);
                  }
                }}
                className="bg-transparent text-gray-800 font-semibold focus:outline-none cursor-pointer"
              >
                {districts.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name} ({d.region})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-300 text-xs">
              <span className="text-gray-500 font-medium">Taluka:</span>
              <select
                value={selectedTaluka}
                onChange={(e) => setSelectedTaluka(e.target.value)}
                className="bg-transparent text-gray-800 font-semibold focus:outline-none cursor-pointer"
              >
                {currentDistObj?.talukas?.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Feature Tab Navigation */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100 text-xs">
          {[
            { id: 'report-form', label: 'Report Emergency / Damage', icon: PlusCircle },
            { id: 'tracking', label: `Track Grievances (${farmerReports.length})`, icon: Clock },
            { id: 'schemes', label: 'Government Schemes & Compensation', icon: FileText },
            { id: 'advisories', label: 'Agro-Weather & Drought Advisories', icon: Droplets },
          ].map((tab) => {
            const Icon = tab.icon;
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-xl flex items-center gap-2 font-semibold transition-all ${
                  isTabActive
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:text-gray-900 border border-gray-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: FARMER EMERGENCY REPORT FORM */}
      {activeTab === 'report-form' && (
        <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-start justify-between border-b border-gray-100 pb-3">
            <div>
              <h2 className="font-extrabold text-gray-900 text-base">
                Lodge Farmer Emergency & Crop Loss Report
              </h2>
              <p className="text-gray-500 text-xs mt-0.5">
                Eligible for expedited Talathi field Panchnama and PMFBY localized calamity compensation.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300">
              72-Hour Rule Enforced
            </span>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-700 font-medium block mb-1">Farmer Full Name *</label>
                <input
                  type="text"
                  required
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  placeholder="e.g. Ramesh Baburao Patil"
                  className="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-gray-700 font-medium block mb-1">Village Name *</label>
                <input
                  type="text"
                  required
                  value={villageName}
                  onChange={(e) => setVillageName(e.target.value)}
                  placeholder="e.g. Khadki / Kasegaon"
                  className="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-gray-700 font-medium block mb-1">Incident Category</label>
                <select
                  value={reportCategory}
                  onChange={(e) => setReportCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:border-amber-500"
                >
                  <option value="Crop Damage & Inundation">Crop Damage & Inundation</option>
                  <option value="Water Shortage & Drought">Water Shortage & Drought</option>
                  <option value="Hailstorm & Wind Lodging">Hailstorm & Wind Lodging</option>
                  <option value="Soil Erosion & Siltation">Soil Erosion & Siltation</option>
                </select>
              </div>

              <div>
                <label className="text-gray-700 font-medium block mb-1">Crop Type</label>
                <select
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:border-amber-500"
                >
                  <option value="Nagpur Santra (Orange)">Nagpur Santra (Orange)</option>
                  <option value="Cotton (Kapus)">Cotton (Kapus)</option>
                  <option value="Soybean">Soybean</option>
                  <option value="Table Grapes">Table Grapes</option>
                  <option value="Pomegranate (Bhagwa)">Pomegranate (Bhagwa)</option>
                  <option value="Tur / Pigeon Pea">Tur / Pigeon Pea</option>
                  <option value="Paddy / Rice">Paddy / Rice</option>
                </select>
              </div>

              <div>
                <label className="text-gray-700 font-medium block mb-1">Acreage Affected (Acres)</label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  value={acreage}
                  onChange={(e) => setAcreage(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="text-gray-700 font-medium block mb-1">Detailed Description of Loss / Conditions *</label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe water depth in field, duration of stagnation, root rot signs, or canal dry spell..."
                className="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Optional Photo Upload UI */}
            <div>
              <label className="text-gray-700 font-medium block mb-1">
                Optional Geotagged Field Photo / Survey Evidence
              </label>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-dashed border-gray-300">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  className="hidden"
                  id="farmer-photo-input"
                />
                <label
                  htmlFor="farmer-photo-input"
                  className="px-3 py-1.5 rounded-lg bg-white border border-gray-300 text-gray-700 font-semibold cursor-pointer hover:bg-gray-100 flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5 text-amber-600" />
                  <span>Choose Photo</span>
                </label>
                <span className="text-gray-500">
                  {uploadedPhoto ? `Attached: ${uploadedPhoto}` : 'Upload photo of standing water or crop damage (JPG, PNG)'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <span className="text-[11px] text-gray-500 font-mono">
                Helpline: <strong>1800-200-5142</strong> / Dial 14447
              </span>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs flex items-center gap-1.5 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Submit Grievance to Taluka Desk</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: COMPLAINT / GRIEVANCE TRACKING */}
      {activeTab === 'tracking' && (
        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h2 className="font-extrabold text-gray-900 text-base">
                Logged Farmer Grievances & Claim Status Tracking
              </h2>
              <p className="text-gray-500 text-xs">
                Real-time tracking of damage intimations submitted across {selectedDistrict} and Vidarbha.
              </p>
            </div>
            <span className="text-xs text-gray-500 font-mono">
              Total: {farmerReports.length} Records
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {farmerReports.map((report) => (
              <div
                key={report.id}
                className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2 text-xs"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-emerald-800 font-bold">{report.id}</span>
                    <h3 className="font-bold text-gray-900 text-sm mt-0.5">{report.farmerName}</h3>
                    <div className="text-gray-500 text-[11px]">
                      {report.village}, {report.taluka} ({report.district})
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    {report.crop}
                  </span>
                </div>

                <p className="text-gray-700 leading-relaxed">{report.description}</p>

                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-gray-200">
                  <span className="text-gray-500">
                    Acreage: <strong>{report.acreageAffected} Acres</strong>
                  </span>
                  <span className="font-semibold text-amber-800">
                    {report.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: GOVERNMENT SCHEMES & COMPENSATION */}
      {activeTab === 'schemes' && (
        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h2 className="font-extrabold text-gray-900 text-base">
                Maharashtra Government Schemes & Disaster Compensation Guidelines
              </h2>
              <p className="text-gray-500 text-xs">
                Statutory schemes available for localized inundation, drought relief, and climate resilience.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* PMFBY Card */}
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-900 text-sm">
                  Pradhan Mantri Fasal Bima Yojana (PMFBY)
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-bold text-[10px]">
                  72h Window
                </span>
              </div>
              <p className="text-amber-800 leading-relaxed">
                Covers localized disaster losses from cloudburst, inundation, or hailstorms. Farmers must lodge intimation on the Crop Insurance App within 72 hours.
              </p>
              <div className="text-[11px] text-gray-700 space-y-0.5 pt-1">
                <div>• Portal: <strong>pmfby.gov.in</strong></div>
                <div>• Required: 7/12 Satbara, Aadhaar copy, Bank IFSC passbook, Field photo</div>
              </div>
            </div>

            {/* PoCRA Card */}
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900 text-sm">
                  Nanaji Deshmukh Krishi Sanjeevani (PoCRA)
                </span>
                <span className="px-2 py-0.5 rounded bg-gray-200 text-gray-800 font-bold text-[10px]">
                  Climate Resilient
                </span>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Direct financial subsidies for Vidarbha & Marathwada farmers for micro-drip irrigation, farm ponds (Shet Tale), and shade nets.
              </p>
              <div className="text-[11px] text-gray-700 pt-1">
                Portal: <strong>mahapocra.gov.in</strong>
              </div>
            </div>

            {/* Mahadbt Card */}
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900 text-sm">
                  Mahadbt Farmer Welfare Portal
                </span>
                <span className="px-2 py-0.5 rounded bg-gray-200 text-gray-800 font-bold text-[10px]">
                  DBT Subsidies
                </span>
              </div>
              <p className="text-gray-600 leading-relaxed">
                State subsidies for agricultural implements, dewatering pumps, and soil health replenishment cards.
              </p>
              <div className="text-[11px] text-gray-700 pt-1">
                Portal: <strong>mahadbt.maharashtra.gov.in</strong>
              </div>
            </div>

            {/* PM-KUSUM */}
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900 text-sm">
                  PM-KUSUM Solar Agricultural Pumps
                </span>
                <span className="px-2 py-0.5 rounded bg-gray-200 text-gray-800 font-bold text-[10px]">
                  Water Security
                </span>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Up to 90% capital subsidy for off-grid solar agricultural irrigation pumps to secure water access during dry spells.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: AGRO-WEATHER & DROUGHT ADVISORIES */}
      {activeTab === 'advisories' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm space-y-1">
              <span className="text-gray-500 font-medium">Soil Moisture</span>
              <div className="text-2xl font-bold font-mono text-gray-900">{intel?.soilMoisturePercent || 84.5}%</div>
              <p className="text-gray-500 text-[11px]">Black cotton clay soil saturation level</p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm space-y-1">
              <span className="text-gray-500 font-medium">Reservoir Storage</span>
              <div className="text-2xl font-bold font-mono text-blue-700">{intel?.reservoirStoragePercent || 76.2}%</div>
              <p className="text-gray-500 text-[11px]">{intel?.reservoirName || 'Totladoh Dam'}</p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm space-y-1">
              <span className="text-gray-500 font-medium">Drought Index</span>
              <div className="text-lg font-bold text-emerald-700">{intel?.droughtIndex || 'Adequate Moisture'}</div>
              <p className="text-gray-500 text-[11px]">Standard Precipitation Index (SPI)</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 font-bold text-gray-900 text-sm">
              <Droplets className="w-4 h-4 text-amber-600" />
              <span>Irrigation & Orchard Drainage Directives</span>
            </div>
            <p className="text-xs text-gray-700 leading-relaxed">
              {intel?.irrigationAdvisory || 'Open drainage furrows immediately to drain standing rain water away from tree roots.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
