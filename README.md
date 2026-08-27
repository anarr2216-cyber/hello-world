<!DOCTYPE html>
<html lang="zh-Hant">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🚗 汽機車獨立專屬保養紀錄與成本管理系統</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Chart.js CDN -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;700;900&display=swap');
        body {
            font-family: 'Noto Sans TC', sans-serif;
            background-color: #f8fafc;
        }
        .veh-card-active {
            border-color: #2563eb !important;
            background: linear-gradient(135deg, #eff6ff 0%, #ffffff 100%);
            box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.12), 0 4px 6px -4px rgba(37, 99, 235, 0.1);
        }
        .subtab-btn.active {
            border-bottom: 2px solid #2563eb;
            color: #1d4ed8;
            font-weight: 700;
        }
        .custom-scrollbar::-webkit-scrollbar {
            height: 6px;
            width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 4px;
        }
    </style>
</head>
<body class="text-slate-800 antialiased min-h-screen flex flex-col bg-slate-50">

    <!-- Top Header -->
    <header class="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-md sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">
                <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-400 text-xl shadow-inner">
                        <i class="fa-solid fa-car-rear"></i>
                    </div>
                    <div>
                        <h1 class="font-bold text-base sm:text-lg leading-tight tracking-wide">車輛獨立專屬保養與花費管理系統</h1>
                        <p class="text-xs text-indigo-300 font-light">依車輛獨立分離檢視 • 保養/耗材/油耗/稅費全面獨立隔離</p>
                    </div>
                </div>
                <div class="flex items-center space-x-2">
                    <button onclick="switchMainView('separated')" id="btn-view-separated" class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white shadow flex items-center gap-1.5 transition">
                        <i class="fa-solid fa-layer-group"></i> 單車獨立檢視
                    </button>
                    <button onclick="switchMainView('all_cards')" id="btn-view-allcards" class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white flex items-center gap-1.5 transition">
                        <i class="fa-solid fa-table-cells-large"></i> 全車隊並排檢視
                    </button>
                </div>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        <!-- ================= VIEW MODE 1: SINGLE VEHICLE INDEPENDENT VIEW (DEFAULT) ================= -->
        <div id="view-separated" class="space-y-6">
            
            <!-- Vehicle Selector Top Bar -->
            <div>
                <div class="flex items-center justify-between mb-2.5">
                    <h2 class="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <i class="fa-solid fa-warehouse text-blue-600"></i> 請選擇欲查看的專屬愛車
                    </h2>
                    <span class="text-xs text-slate-400">點選車輛立即切換獨立專屬明細</span>
                </div>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4" id="vehicle-selector-cards">
                    <!-- Populated dynamically by JS -->
                </div>
            </div>

            <!-- Active Vehicle Detail Panel (Completely Isolated) -->
            <div id="active-vehicle-container" class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all">
                
                <!-- Vehicle Header Banner -->
                <div class="p-6 bg-gradient-to-r from-slate-900 to-blue-950 text-white relative overflow-hidden">
                    <div class="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-10 text-9xl">
                        <i id="active-veh-icon-bg" class="fa-solid fa-car"></i>
                    </div>
                    <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div class="flex items-center gap-4">
                            <div id="active-veh-avatar" class="w-14 h-14 rounded-2xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-2xl text-blue-300 shadow">
                                <i class="fa-solid fa-car"></i>
                            </div>
                            <div>
                                <div class="flex items-center gap-2.5">
                                    <span id="active-veh-id" class="px-2.5 py-0.5 rounded-md bg-blue-500/20 border border-blue-400/40 text-blue-300 font-bold text-xs tracking-wider">Car-01</span>
                                    <h2 id="active-veh-name" class="text-xl sm:text-2xl font-black tracking-wide">家庭休旅車 (Toyota RAV4 2.0)</h2>
                                </div>
                                <div class="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-300 font-light">
                                    <span><i class="fa-solid fa-id-card text-blue-400 mr-1"></i> 車牌：<strong id="active-veh-plate" class="text-white font-mono">ABC-8899</strong></span>
                                    <span><i class="fa-solid fa-gauge text-blue-400 mr-1"></i> 當前總里程：<strong id="active-veh-mileage" class="text-white font-mono">35,200 km</strong></span>
                                    <span><i class="fa-solid fa-calendar text-blue-400 mr-1"></i> 出廠年份：<strong id="active-veh-year" class="text-white">2021</strong> (<span id="active-veh-cc">1987</span> cc)</span>
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center gap-3">
                            <div class="bg-slate-800/80 backdrop-blur border border-slate-700/80 px-4 py-2.5 rounded-xl text-right">
                                <p class="text-[11px] text-slate-400">該車累計總花費 (TCO)</p>
                                <p id="active-veh-tco" class="text-xl font-black text-amber-400 font-mono">NT$ 51,098</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Independent Stats Quick Cards for this vehicle -->
                <div class="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-slate-100 border-b border-slate-200 bg-slate-50/50">
                    <div class="p-4 flex items-center justify-between">
                        <div>
                            <p class="text-xs font-medium text-slate-500">保養維修支出</p>
                            <h4 id="stat-veh-maint" class="text-lg font-bold text-indigo-700 font-mono mt-0.5">NT$ 6,200</h4>
                            <p class="text-[11px] text-slate-400" id="stat-veh-maint-count">共 2 次保養紀錄</p>
                        </div>
                        <div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg">
                            <i class="fa-solid fa-wrench"></i>
                        </div>
                    </div>
                    <div class="p-4 flex items-center justify-between">
                        <div>
                            <p class="text-xs font-medium text-slate-500">累計燃油油資</p>
                            <h4 id="stat-veh-fuel" class="text-lg font-bold text-amber-600 font-mono mt-0.5">NT$ 3,991</h4>
                            <p class="text-[11px] text-slate-400" id="stat-veh-fuel-avg">平均 12.3 km/L</p>
                        </div>
                        <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg">
                            <i class="fa-solid fa-gas-pump"></i>
                        </div>
                    </div>
                    <div class="p-4 flex items-center justify-between">
                        <div>
                            <p class="text-xs font-medium text-slate-500">稅費/保險/雜支</p>
                            <h4 id="stat-veh-exp" class="text-lg font-bold text-emerald-600 font-mono mt-0.5">NT$ 47,410</h4>
                            <p class="text-[11px] text-slate-400" id="stat-veh-exp-count">牌照/燃料/乙式車險</p>
                        </div>
                        <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg">
                            <i class="fa-solid fa-shield-halved"></i>
                        </div>
                    </div>
                    <div class="p-4 flex items-center justify-between">
                        <div>
                            <p class="text-xs font-medium text-slate-500">養車每公里成本</p>
                            <h4 id="stat-veh-costkm" class="text-lg font-bold text-slate-800 font-mono mt-0.5">NT$ 1.45</h4>
                            <p class="text-[11px] text-slate-400">總支出 ÷ 累積里程</p>
                        </div>
                        <div class="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center text-lg">
                            <i class="fa-solid fa-chart-line"></i>
                        </div>
                    </div>
                </div>

                <!-- Sub-tabs for the Selected Vehicle -->
                <div class="border-b border-slate-200 px-6 bg-white flex space-x-6 overflow-x-auto custom-scrollbar">
                    <button onclick="switchSubTab('maint')" id="subtab-btn-maint" class="subtab-btn active py-3.5 text-sm font-semibold text-slate-600 hover:text-blue-600 flex items-center gap-2 transition">
                        <i class="fa-solid fa-wrench"></i> 專屬保養紀錄明細 (<span id="count-sub-maint">0</span>)
                    </button>
                    <button onclick="switchSubTab('alert')" id="subtab-btn-alert" class="subtab-btn py-3.5 text-sm font-semibold text-slate-600 hover:text-blue-600 flex items-center gap-2 transition">
                        <i class="fa-solid fa-triangle-exclamation"></i> 耗材即時壽命與週期預警 (<span id="count-sub-alert">0</span>)
                    </button>
                    <button onclick="switchSubTab('fuel')" id="subtab-btn-fuel" class="subtab-btn py-3.5 text-sm font-semibold text-slate-600 hover:text-blue-600 flex items-center gap-2 transition">
                        <i class="fa-solid fa-gas-pump"></i> 加油油耗明細 (<span id="count-sub-fuel">0</span>)
                    </button>
                    <button onclick="switchSubTab('exp')" id="subtab-btn-exp" class="subtab-btn py-3.5 text-sm font-semibold text-slate-600 hover:text-blue-600 flex items-center gap-2 transition">
                        <i class="fa-solid fa-receipt"></i> 專屬稅費與保險紀錄 (<span id="count-sub-exp">0</span>)
                    </button>
                    <button onclick="switchSubTab('info')" id="subtab-btn-info" class="subtab-btn py-3.5 text-sm font-semibold text-slate-600 hover:text-blue-600 flex items-center gap-2 transition">
                        <i class="fa-solid fa-address-card"></i> 車籍與證件法規
                    </button>
                </div>

                <!-- Sub-tab Content Area -->
                <div class="p-6">
                    
                    <!-- 1. Dedicated Maintenance Records -->
                    <div id="subtab-content-maint" class="space-y-4">
                        <div class="flex items-center justify-between">
                            <h3 class="font-bold text-slate-800 text-sm flex items-center gap-2">
                                <i class="fa-solid fa-list-check text-blue-600"></i> 本車保養維修歷史履歷
                            </h3>
                            <span class="text-xs text-slate-400">獨立紀錄，不與其他車輛混雜</span>
                        </div>
                        <div class="overflow-x-auto border border-slate-200 rounded-xl custom-scrollbar">
                            <table class="w-full text-left text-xs sm:text-sm text-slate-600">
                                <thead class="bg-slate-800 text-white font-medium">
                                    <tr>
                                        <th class="p-3 text-center">單號</th>
                                        <th class="p-3 text-center">保養日期</th>
                                        <th class="p-3 text-right">保養里程</th>
                                        <th class="p-3 text-center">分類</th>
                                        <th class="p-3">保養/維修項目內容</th>
                                        <th class="p-3 text-right">零件費用</th>
                                        <th class="p-3 text-right">工資費用</th>
                                        <th class="p-3 text-right font-bold text-blue-300">總花費</th>
                                        <th class="p-3 text-right">下次建議里程</th>
                                        <th class="p-3">施作保養廠</th>
                                        <th class="p-3">備註</th>
                                    </tr>
                                </thead>
                                <tbody id="active-maint-tbody" class="divide-y divide-slate-100">
                                    <!-- Populated by JS -->
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- 2. Dedicated Alert & Status -->
                    <div id="subtab-content-alert" class="hidden space-y-4">
                        <div class="flex items-center justify-between">
                            <h3 class="font-bold text-slate-800 text-sm flex items-center gap-2">
                                <i class="fa-solid fa-bell text-amber-500"></i> 本車專屬耗材壽命監控
                            </h3>
                            <span class="text-xs text-slate-400">依此車目前總里程動態扣減</span>
                        </div>
                        <div class="overflow-x-auto border border-slate-200 rounded-xl custom-scrollbar">
                            <table class="w-full text-left text-xs sm:text-sm text-slate-600">
                                <thead class="bg-slate-800 text-white font-medium">
                                    <tr>
                                        <th class="p-3">耗材檢查項目</th>
                                        <th class="p-3 text-right">上次更換里程</th>
                                        <th class="p-3 text-right">已使用里程</th>
                                        <th class="p-3 text-right">建議週期 (km)</th>
                                        <th class="p-3 text-right font-bold">剩餘可行駛壽命</th>
                                        <th class="p-3 text-center">狀態判定</th>
                                        <th class="p-3 text-center">上次更換日期</th>
                                        <th class="p-3">建議處置方式</th>
                                    </tr>
                                </thead>
                                <tbody id="active-alert-tbody" class="divide-y divide-slate-100">
                                    <!-- Populated by JS -->
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- 3. Dedicated Fuel Records -->
                    <div id="subtab-content-fuel" class="hidden space-y-4">
                        <div class="flex items-center justify-between">
                            <h3 class="font-bold text-slate-800 text-sm flex items-center gap-2">
                                <i class="fa-solid fa-gas-pump text-amber-600"></i> 本車專屬加油與油耗紀錄
                            </h3>
                            <span class="text-xs text-slate-400">單獨記錄每趟加油數據</span>
                        </div>
                        <div class="overflow-x-auto border border-slate-200 rounded-xl custom-scrollbar">
                            <table class="w-full text-left text-xs sm:text-sm text-slate-600">
                                <thead class="bg-slate-800 text-white font-medium">
                                    <tr>
                                        <th class="p-3 text-center">加油日期</th>
                                        <th class="p-3 text-right">加油里程 (km)</th>
                                        <th class="p-3 text-right">單趟行駛 (km)</th>
                                        <th class="p-3 text-center">油品種類</th>
                                        <th class="p-3 text-right">單價(元/L)</th>
                                        <th class="p-3 text-right">加油量(L)</th>
                                        <th class="p-3 text-right font-bold text-amber-300">加油金額</th>
                                        <th class="p-3 text-right font-semibold text-emerald-400">平均油耗 (km/L)</th>
                                        <th class="p-3 text-right">每公里油資</th>
                                        <th class="p-3">備註 / 加油站</th>
                                    </tr>
                                </thead>
                                <tbody id="active-fuel-tbody" class="divide-y divide-slate-100">
                                    <!-- Populated by JS -->
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- 4. Dedicated Expenses -->
                    <div id="subtab-content-exp" class="hidden space-y-4">
                        <div class="flex items-center justify-between">
                            <h3 class="font-bold text-slate-800 text-sm flex items-center gap-2">
                                <i class="fa-solid fa-file-invoice text-emerald-600"></i> 本車專屬稅費、保險與雜項支出
                            </h3>
                            <span class="text-xs text-slate-400">獨立年度規費清單</span>
                        </div>
                        <div class="overflow-x-auto border border-slate-200 rounded-xl custom-scrollbar">
                            <table class="w-full text-left text-xs sm:text-sm text-slate-600">
                                <thead class="bg-slate-800 text-white font-medium">
                                    <tr>
                                        <th class="p-3 text-center">支出日期</th>
                                        <th class="p-3 text-center">支出分類</th>
                                        <th class="p-3">費用項目名稱</th>
                                        <th class="p-3 text-right font-bold text-emerald-300">支出金額</th>
                                        <th class="p-3 text-center">涵蓋效期</th>
                                        <th class="p-3 text-center">繳納方式</th>
                                        <th class="p-3">備註</th>
                                    </tr>
                                </thead>
                                <tbody id="active-exp-tbody" class="divide-y divide-slate-100">
                                    <!-- Populated by JS -->
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- 5. Dedicated Vehicle Info -->
                    <div id="subtab-content-info" class="hidden space-y-4">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
                                <h4 class="font-bold text-slate-800 text-sm flex items-center gap-2">
                                    <i class="fa-solid fa-car text-blue-600"></i> 車籍基本規格
                                </h4>
                                <div class="grid grid-cols-2 gap-2 text-xs">
                                    <div class="p-2.5 bg-white rounded-lg border border-slate-200">
                                        <p class="text-slate-400">車輛型式</p>
                                        <p id="info-veh-type" class="font-bold text-slate-700 mt-0.5">-</p>
                                    </div>
                                    <div class="p-2.5 bg-white rounded-lg border border-slate-200">
                                        <p class="text-slate-400">廠牌型號</p>
                                        <p id="info-veh-model" class="font-bold text-slate-700 mt-0.5">-</p>
                                    </div>
                                    <div class="p-2.5 bg-white rounded-lg border border-slate-200">
                                        <p class="text-slate-400">排氣量</p>
                                        <p id="info-veh-cc" class="font-bold text-slate-700 mt-0.5">-</p>
                                    </div>
                                    <div class="p-2.5 bg-white rounded-lg border border-slate-200">
                                        <p class="text-slate-400">出廠年份</p>
                                        <p id="info-veh-year" class="font-bold text-slate-700 mt-0.5">-</p>
                                    </div>
                                    <div class="p-2.5 bg-white rounded-lg border border-slate-200 col-span-2">
                                        <p class="text-slate-400">車身號碼 (VIN)</p>
                                        <p id="info-veh-vin" class="font-mono font-bold text-slate-700 mt-0.5">-</p>
                                    </div>
                                </div>
                            </div>
                            <div class="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
                                <h4 class="font-bold text-slate-800 text-sm flex items-center gap-2">
                                    <i class="fa-solid fa-shield-check text-emerald-600"></i> 保險與檢驗期程
                                </h4>
                                <div class="space-y-2 text-xs">
                                    <div class="p-2.5 bg-white rounded-lg border border-slate-200 flex justify-between items-center">
                                        <div>
                                            <p class="text-slate-400">強制責任險到期日</p>
                                            <p id="info-veh-ins1" class="font-mono font-bold text-slate-700 mt-0.5">-</p>
                                        </div>
                                        <span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[11px] font-semibold">有效中</span>
                                    </div>
                                    <div class="p-2.5 bg-white rounded-lg border border-slate-200 flex justify-between items-center">
                                        <div>
                                            <p class="text-slate-400">任意商業車險到期日</p>
                                            <p id="info-veh-ins2" class="font-mono font-bold text-slate-700 mt-0.5">-</p>
                                        </div>
                                        <span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[11px] font-semibold">有效中</span>
                                    </div>
                                    <div class="p-2.5 bg-white rounded-lg border border-slate-200 flex justify-between items-center">
                                        <div>
                                            <p class="text-slate-400">監理所下次定檢日期</p>
                                            <p id="info-veh-check" class="font-mono font-bold text-slate-700 mt-0.5">-</p>
                                        </div>
                                        <span class="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[11px] font-semibold">準時檢驗</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>

        </div>

        <!-- ================= VIEW MODE 2: ALL VEHICLES INDEPENDENT CARDS SIDE-BY-SIDE ================= -->
        <div id="view-allcards" class="hidden space-y-6">
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <i class="fa-solid fa-table-columns text-blue-600"></i> 每台車獨立專屬保養卡片總覽
                    </h2>
                    <p class="text-xs text-slate-500 mt-0.5">每部車輛各自擁有獨立的保養紀錄與花費面板，完全分隔展示</p>
                </div>
            </div>
            
            <div id="all-vehicles-separated-grid" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Dynamically generated independent complete cards for each vehicle -->
            </div>
        </div>

    </main>

    <!-- Footer -->
    <footer class="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-4 text-center">
        <p>車輛獨立保養專屬管理系統 • 獨立分離架構 Edition</p>
    </footer>

    <!-- JavaScript Data Logic -->
    <script>
        // Vehicle database
        const vehicles = [
            { 
                id: "Car-01", 
                name: "家庭休旅車", 
                plate: "ABC-8899", 
                type: "四輪汽車 (SUV)", 
                model: "Toyota RAV4 2.0", 
                year: 2021, 
                cc: 1987, 
                mileage: 35200, 
                vin: "JTMDFREV123456", 
                ins1: "2027-03-15", 
                ins2: "2027-03-15", 
                checkDate: "2026-11-20", 
                status: "使用中",
                icon: "fa-solid fa-car-side"
            },
            { 
                id: "Car-02", 
                name: "市區代步小車", 
                plate: "BDE-1234", 
                type: "四輪汽車 (Hatchback)", 
                model: "Honda Fit 1.5", 
                year: 2018, 
                cc: 1498, 
                mileage: 68000, 
                vin: "JHMGK585001234", 
                ins1: "2026-10-10", 
                ins2: "2026-10-10", 
                checkDate: "2026-09-15", 
                status: "使用中",
                icon: "fa-solid fa-car"
            },
            { 
                id: "Moto-01", 
                name: "勁戰通勤機車", 
                plate: "MYG-678", 
                type: "普通重型機車 (125cc)", 
                model: "Yamaha Cygnus Gryphus 125", 
                year: 2022, 
                cc: 124, 
                mileage: 12500, 
                vin: "RKRSE341001234", 
                ins1: "2027-05-20", 
                ins2: "2027-05-20", 
                checkDate: "2027-05-20", 
                status: "使用中",
                icon: "fa-solid fa-motorcycle"
            },
            { 
                id: "Moto-02", 
                name: "紅牌運動重機", 
                plate: "LGD-5566", 
                type: "大型重型機車 (Red Plate)", 
                model: "Honda CB650R", 
                year: 2020, 
                cc: 649, 
                mileage: 18200, 
                vin: "MLHRC080001234", 
                ins1: "2026-12-01", 
                ins2: "2026-12-01", 
                checkDate: "2026-12-01", 
                status: "使用中",
                icon: "fa-solid fa-person-biking"
            }
        ];

        // Isolated maintenance logs
        const maintenanceLogs = [
            { id: "M-001", date: "2026-01-10", vehId: "Car-01", mileage: 30000, cat: "機油保養", desc: "更換 0W-20 原廠機油 4.2L + 原廠機油芯", partCost: 2200, laborCost: 600, nextMileage: 35000, shop: "Toyota 原廠服務廠", note: "附贈全車清潔" },
            { id: "M-005", date: "2026-06-18", vehId: "Car-01", mileage: 35000, cat: "定期保養", desc: "更換 0W-20 機油 + 空氣濾清器 + 冷氣濾網", partCost: 2800, laborCost: 600, nextMileage: 40000, shop: "Toyota 原廠服務廠", note: "調胎、平衡與底盤螺絲扭力檢查" },
            
            { id: "M-003", date: "2026-03-05", vehId: "Car-02", mileage: 65000, cat: "底盤懸吊", desc: "更換前輪煞車來令片一組 + 煞車油循環更換", partCost: 3200, laborCost: 1200, nextMileage: 95000, shop: "馳加汽車保養中心", note: "碟盤厚度正常" },
            { id: "M-007", date: "2026-08-01", vehId: "Car-02", mileage: 68000, cat: "電系點火", desc: "更換 湯淺 60B24L 專用電瓶", partCost: 2400, laborCost: 200, nextMileage: 108000, shop: "專業電瓶館", note: "舊電瓶壽命35%預防性換新" },
            
            { id: "M-002", date: "2026-01-20", vehId: "Moto-01", mileage: 10000, cat: "機油保養", desc: "更換 10W-40 全合成機油 + 齒輪油 + 空濾", partCost: 550, laborCost: 150, nextMileage: 12000, shop: "車行小林機車", note: "胎壓調整前28/後32" },
            { id: "M-006", date: "2026-07-02", vehId: "Moto-01", mileage: 12000, cat: "底盤耗材", desc: "更換後輪胎 (MAXXIS S98M 120/70-12) + 金屬氣嘴", partCost: 1800, laborCost: 200, nextMileage: 22000, shop: "優質輪胎專賣", note: "舊胎磨損至警示線換新" },

            { id: "M-004", date: "2026-04-12", vehId: "Moto-02", mileage: 15000, cat: "傳動系統", desc: "更換 RK 黃金油封鏈條 + 前後齒盤組", partCost: 4800, laborCost: 1000, nextMileage: 35000, shop: "重機動力專門店", note: "鏈條鬆緊度微調完畢" }
        ];

        // Isolated fuel logs
        const fuelLogs = [
            { date: "2026-07-01", vehId: "Car-01", meter: 34200, trip: 0, fuelType: "95 無鉛", unitPrice: 31.5, volume: 45.0, cost: 1417.5, kml: 0, costPerKm: 0, note: "中油直營 (起算點)" },
            { date: "2026-07-15", vehId: "Car-01", meter: 34740, trip: 540, fuelType: "95 無鉛", unitPrice: 31.6, volume: 43.2, cost: 1365.12, kml: 12.5, costPerKm: 2.53, note: "中油直營 (市區+高速)" },
            { date: "2026-08-01", vehId: "Car-01", meter: 35200, trip: 460, fuelType: "95 無鉛", unitPrice: 31.8, volume: 38.0, cost: 1208.4, kml: 12.11, costPerKm: 2.63, note: "全國加油站 (長途出遊)" },

            { date: "2026-07-10", vehId: "Moto-01", meter: 12050, trip: 0, fuelType: "92 無鉛", unitPrice: 29.8, volume: 5.2, cost: 154.96, kml: 0, costPerKm: 0, note: "台塑加油 (起算點)" },
            { date: "2026-07-22", vehId: "Moto-01", meter: 12280, trip: 230, fuelType: "92 無鉛", unitPrice: 29.9, volume: 5.4, cost: 161.46, kml: 42.59, costPerKm: 0.70, note: "中油 (日常通勤)" },
            { date: "2026-08-05", vehId: "Moto-01", meter: 12500, trip: 220, fuelType: "92 無鉛", unitPrice: 30.1, volume: 5.1, cost: 153.51, kml: 43.14, costPerKm: 0.70, note: "中油 (日常通勤)" }
        ];

        // Isolated expenses
        const expenseLogs = [
            { date: "2026-03-15", vehId: "Car-01", cat: "車體保險", item: "富邦乙式車體險 + 超額責任險 2000萬", amount: 26500, period: "115年度", method: "信用卡", note: "含道路救援" },
            { date: "2026-04-10", vehId: "Car-01", cat: "稅費規費", item: "115年度 汽車牌照稅 (1987cc)", amount: 11230, period: "115年度", method: "台灣Pay", note: "" },
            { date: "2026-07-05", vehId: "Car-01", cat: "稅費規費", item: "115年度 汽車燃料使用費 (1987cc)", amount: 6180, period: "115年度", method: "金融扣繳", note: "" },
            { date: "2026-05-01", vehId: "Car-01", cat: "洗車美容", item: "石英鍍膜全車深層維護", amount: 3500, period: "半年定期", method: "現金", note: "潑水層強化" },

            { date: "2026-04-15", vehId: "Car-02", cat: "稅費規費", item: "115年度 汽車牌照稅 (1498cc)", amount: 7120, period: "115年度", method: "信用卡", note: "" },
            { date: "2026-07-15", vehId: "Car-02", cat: "稅費規費", item: "115年度 汽車燃料使用費 (1498cc)", amount: 4800, period: "115年度", method: "信用卡", note: "" },

            { date: "2026-05-18", vehId: "Moto-01", cat: "車體保險", item: "強制險 + 機車第三人責任險+駕駛人傷害險", amount: 1850, period: "1年期", method: "信用卡", note: "通勤專用保險" },
            { date: "2026-07-12", vehId: "Moto-01", cat: "稅費規費", item: "115-116年度 機車燃料使用費 (124cc)", amount: 900, period: "2年期", method: "超商繳納", note: "" }
        ];

        // Isolated alerts
        const alertSettings = [
            { vehId: "Car-01", item: "全合成引擎機油", lastKm: 35000, cycle: 5000, lastDate: "2026-06-18", action: "更換 0W-20 原廠機油" },
            { vehId: "Car-01", item: "無段變速箱油 (CVT Fluid)", lastKm: 20000, cycle: 20000, lastDate: "2025-05-10", action: "原廠 CVT 油循環更換" },
            { vehId: "Car-01", item: "冷氣活性碳濾網", lastKm: 35000, cycle: 10000, lastDate: "2026-06-18", action: "更換 PM2.5 活性碳濾網" },

            { vehId: "Car-02", item: "煞車油 (DOT4)", lastKm: 50000, cycle: 20000, lastDate: "2025-02-15", action: "全車煞車油循環抽換" },
            { vehId: "Car-02", item: "火星塞 (銥合金)", lastKm: 40000, cycle: 40000, lastDate: "2024-06-10", action: "更換 4 支專用火星塞" },

            { vehId: "Moto-01", item: "機油與齒輪油", lastKm: 12000, cycle: 1000, lastDate: "2026-07-02", action: "更換機油 + 齒輪油" },
            { vehId: "Moto-01", item: "傳動驅動皮帶", lastKm: 0, cycle: 15000, lastDate: "2022-05-01", action: "檢查皮帶寬度與龜裂" },

            { vehId: "Moto-02", item: "前/後煞車來令片", lastKm: 10000, cycle: 15000, lastDate: "2025-08-10", action: "檢查來令片殘餘厚度" },
            { vehId: "Moto-02", item: "冷卻水箱精 (Coolant)", lastKm: 0, cycle: 20000, lastDate: "2020-06-01", action: "更換水箱水與清洗水道" }
        ];

        let selectedVehId = "Car-01";

        function formatMoney(num) {
            return 'NT$ ' + Math.round(num).toLocaleString();
        }

        // Initialize and populate UI
        function initApp() {
            renderVehicleSelector();
            selectVehicle(selectedVehId);
            renderAllVehiclesGrid();
        }

        // Render top selector cards
        function renderVehicleSelector() {
            const container = document.getElementById('vehicle-selector-cards');
            container.innerHTML = vehicles.map(v => {
                const isSelected = v.id === selectedVehId;
                return `
                    <div onclick="selectVehicle('${v.id}')" class="cursor-pointer p-3 sm:p-4 rounded-xl border bg-white transition-all ${isSelected ? 'veh-card-active' : 'border-slate-200 hover:border-slate-300'}">
                        <div class="flex items-center justify-between">
                            <span class="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-mono">${v.id}</span>
                            <i class="${v.icon} text-slate-400"></i>
                        </div>
                        <h4 class="font-bold text-slate-800 text-sm sm:text-base mt-2 truncate">${v.name}</h4>
                        <p class="text-xs text-slate-500 truncate">${v.model}</p>
                        <div class="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                            <span class="text-slate-400">總里程</span>
                            <span class="font-mono font-bold text-slate-700">${v.mileage.toLocaleString()} km</span>
                        </div>
                    </div>
                `;
            }).join('');
        }

        // Switch Active Vehicle in Single View
        function selectVehicle(vehId) {
            selectedVehId = vehId;
            renderVehicleSelector();

            const veh = vehicles.find(v => v.id === vehId);
            if (!veh) return;

            // Fill Banner Info
            document.getElementById('active-veh-id').innerText = veh.id;
            document.getElementById('active-veh-name').innerText = `${veh.name} (${veh.model})`;
            document.getElementById('active-veh-plate').innerText = veh.plate;
            document.getElementById('active-veh-mileage').innerText = veh.mileage.toLocaleString() + ' km';
            document.getElementById('active-veh-year').innerText = veh.year;
            document.getElementById('active-veh-cc').innerText = veh.cc;
            document.getElementById('active-veh-avatar').innerHTML = `<i class="${veh.icon}"></i>`;
            document.getElementById('active-veh-icon-bg').className = veh.icon;

            // Calculate Vehicle Isolated Stats
            const vMaints = maintenanceLogs.filter(m => m.vehId === veh.id);
            const vFuels = fuelLogs.filter(f => f.vehId === veh.id);
            const vExps = expenseLogs.filter(e => e.vehId === veh.id);
            const vAlerts = alertSettings.filter(a => a.vehId === veh.id);

            const totalMaintCost = vMaints.reduce((acc, m) => acc + (m.partCost + m.laborCost), 0);
            const totalFuelCost = vFuels.reduce((acc, f) => acc + f.cost, 0);
            const totalExpCost = vExps.reduce((acc, e) => acc + e.amount, 0);
            const tco = totalMaintCost + totalFuelCost + totalExpCost;
            const costPerKm = veh.mileage > 0 ? (tco / veh.mileage) : 0;

            const fuelKmls = vFuels.filter(f => f.kml > 0);
            const avgKml = fuelKmls.length > 0 ? (fuelKmls.reduce((acc, f) => acc + f.kml, 0) / fuelKmls.length) : 0;

            document.getElementById('active-veh-tco').innerText = formatMoney(tco);
            document.getElementById('stat-veh-maint').innerText = formatMoney(totalMaintCost);
            document.getElementById('stat-veh-maint-count').innerText = `共 ${vMaints.length} 筆保養紀錄`;

            document.getElementById('stat-veh-fuel').innerText = formatMoney(totalFuelCost);
            document.getElementById('stat-veh-fuel-avg').innerText = avgKml > 0 ? `平均 ${avgKml.toFixed(1)} km/L` : '暫無油耗數據';

            document.getElementById('stat-veh-exp').innerText = formatMoney(totalExpCost);
            document.getElementById('stat-veh-exp-count').innerText = `共 ${vExps.length} 筆規費/保險`;

            document.getElementById('stat-veh-costkm').innerText = `NT$ ${costPerKm.toFixed(2)}`;

            // Update Badges Count
            document.getElementById('count-sub-maint').innerText = vMaints.length;
            document.getElementById('count-sub-alert').innerText = vAlerts.length;
            document.getElementById('count-sub-fuel').innerText = vFuels.length;
            document.getElementById('count-sub-exp').innerText = vExps.length;

            // Render Sub Tabs
            renderActiveMaintenanceTable(vMaints);
            renderActiveAlertTable(vAlerts, veh.mileage);
            renderActiveFuelTable(vFuels);
            renderActiveExpenseTable(vExps);
            renderActiveVehicleInfo(veh);
        }

        // Sub Tab Renderers
        function renderActiveMaintenanceTable(logs) {
            const tbody = document.getElementById('active-maint-tbody');
            if (logs.length === 0) {
                tbody.innerHTML = `<tr><td colspan="11" class="p-8 text-center text-slate-400">目前尚無此車輛的獨立保養維修紀錄</td></tr>`;
                return;
            }
            tbody.innerHTML = logs.map(m => {
                const total = m.partCost + m.laborCost;
                return `
                    <tr class="hover:bg-slate-50 transition">
                        <td class="p-3 text-center font-mono text-xs text-slate-400">${m.id}</td>
                        <td class="p-3 text-center font-mono">${m.date}</td>
                        <td class="p-3 text-right font-mono font-bold text-slate-700">${m.mileage.toLocaleString()} km</td>
                        <td class="p-3 text-center"><span class="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold">${m.cat}</span></td>
                        <td class="p-3 font-medium text-slate-800">${m.desc}</td>
                        <td class="p-3 text-right font-mono">${formatMoney(m.partCost)}</td>
                        <td class="p-3 text-right font-mono">${formatMoney(m.laborCost)}</td>
                        <td class="p-3 text-right font-mono font-black text-blue-700 bg-blue-50/40">${formatMoney(total)}</td>
                        <td class="p-3 text-right font-mono text-slate-500">${m.nextMileage.toLocaleString()} km</td>
                        <td class="p-3 text-slate-700 font-medium">${m.shop}</td>
                        <td class="p-3 text-slate-400 text-xs">${m.note || '-'}</td>
                    </tr>
                `;
            }).join('');
        }

        function renderActiveAlertTable(alerts, currentMileage) {
            const tbody = document.getElementById('active-alert-tbody');
            if (alerts.length === 0) {
                tbody.innerHTML = `<tr><td colspan="8" class="p-8 text-center text-slate-400">目前尚未設定此車輛的專屬耗材監控項目</td></tr>`;
                return;
            }
            tbody.innerHTML = alerts.map(a => {
                const driven = currentMileage - a.lastKm;
                const remain = a.cycle - driven;

                let statusBadge = '<span class="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-700">✅ 狀況正常</span>';
                if (remain <= 500) {
                    statusBadge = '<span class="px-2 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-700 animate-pulse">⚠️ 建議立即更換</span>';
                } else if (remain <= 1500) {
                    statusBadge = '<span class="px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-700">⚡ 近期需更換</span>';
                }

                return `
                    <tr class="hover:bg-slate-50 transition">
                        <td class="p-3 font-bold text-slate-800">${a.item}</td>
                        <td class="p-3 text-right font-mono">${a.lastKm.toLocaleString()} km</td>
                        <td class="p-3 text-right font-mono text-slate-600">${driven.toLocaleString()} km</td>
                        <td class="p-3 text-right font-mono text-slate-400">${a.cycle.toLocaleString()} km</td>
                        <td class="p-3 text-right font-mono font-black ${remain <= 500 ? 'text-red-600' : 'text-slate-800'}">${remain.toLocaleString()} km</td>
                        <td class="p-3 text-center">${statusBadge}</td>
                        <td class="p-3 text-center text-slate-500 font-mono">${a.lastDate}</td>
                        <td class="p-3 text-slate-700 font-medium">${a.action}</td>
                    </tr>
                `;
            }).join('');
        }

        function renderActiveFuelTable(fuels) {
            const tbody = document.getElementById('active-fuel-tbody');
            if (fuels.length === 0) {
                tbody.innerHTML = `<tr><td colspan="10" class="p-8 text-center text-slate-400">目前尚無此車輛的加油與油耗紀錄</td></tr>`;
                return;
            }
            tbody.innerHTML = fuels.map(f => `
                <tr class="hover:bg-slate-50 transition">
                    <td class="p-3 text-center font-mono">${f.date}</td>
                    <td class="p-3 text-right font-mono">${f.meter.toLocaleString()} km</td>
                    <td class="p-3 text-right font-mono font-bold text-slate-700">${f.trip > 0 ? f.trip.toLocaleString() + ' km' : '-'}</td>
                    <td class="p-3 text-center"><span class="bg-amber-50 text-amber-800 px-2 py-0.5 rounded text-xs font-semibold">${f.fuelType}</span></td>
                    <td class="p-3 text-right font-mono">$${f.unitPrice.toFixed(1)}</td>
                    <td class="p-3 text-right font-mono">${f.volume.toFixed(1)} L</td>
                    <td class="p-3 text-right font-mono font-bold text-amber-700">${formatMoney(f.cost)}</td>
                    <td class="p-3 text-right font-mono font-bold ${f.kml > 0 ? 'text-emerald-600' : 'text-slate-400'}">${f.kml > 0 ? f.kml.toFixed(2) + ' km/L' : '-'}</td>
                    <td class="p-3 text-right font-mono">${f.costPerKm > 0 ? '$' + f.costPerKm.toFixed(2) : '-'}</td>
                    <td class="p-3 text-slate-500 text-xs">${f.note}</td>
                </tr>
            `).join('');
        }

        function renderActiveExpenseTable(exps) {
            const tbody = document.getElementById('active-exp-tbody');
            if (exps.length === 0) {
                tbody.innerHTML = `<tr><td colspan="7" class="p-8 text-center text-slate-400">目前尚無此車輛的稅費與保險紀錄</td></tr>`;
                return;
            }
            tbody.innerHTML = exps.map(e => `
                <tr class="hover:bg-slate-50 transition">
                    <td class="p-3 text-center font-mono">${e.date}</td>
                    <td class="p-3 text-center"><span class="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-xs font-semibold">${e.cat}</span></td>
                    <td class="p-3 font-semibold text-slate-800">${e.item}</td>
                    <td class="p-3 text-right font-mono font-black text-emerald-700">${formatMoney(e.amount)}</td>
                    <td class="p-3 text-center text-xs text-slate-500">${e.period}</td>
                    <td class="p-3 text-center text-xs font-medium">${e.method}</td>
                    <td class="p-3 text-slate-400 text-xs">${e.note || '-'}</td>
                </tr>
            `).join('');
        }

        function renderActiveVehicleInfo(veh) {
            document.getElementById('info-veh-type').innerText = veh.type;
            document.getElementById('info-veh-model').innerText = veh.model;
            document.getElementById('info-veh-cc').innerText = veh.cc + ' c.c.';
            document.getElementById('info-veh-year').innerText = veh.year + ' 年';
            document.getElementById('info-veh-vin').innerText = veh.vin;
            document.getElementById('info-veh-ins1').innerText = veh.ins1;
            document.getElementById('info-veh-ins2').innerText = veh.ins2;
            document.getElementById('info-veh-check').innerText = veh.checkDate;
        }

        // Sub Tab Switching (Maint, Alert, Fuel, Exp, Info)
        function switchSubTab(tabKey) {
            const subtabs = ['maint', 'alert', 'fuel', 'exp', 'info'];
            subtabs.forEach(t => {
                const btn = document.getElementById('subtab-btn-' + t);
                const content = document.getElementById('subtab-content-' + t);
                if (t === tabKey) {
                    btn.classList.add('active');
                    content.classList.remove('hidden');
                } else {
                    btn.classList.remove('active');
                    content.classList.add('hidden');
                }
            });
        }

        // Main View Switching (Separated vs All Cards Side-by-side)
        function switchMainView(viewMode) {
            const btnSep = document.getElementById('btn-view-separated');
            const btnAll = document.getElementById('btn-view-allcards');
            const secSep = document.getElementById('view-separated');
            const secAll = document.getElementById('view-allcards');

            if (viewMode === 'separated') {
                secSep.classList.remove('hidden');
                secAll.classList.add('hidden');
                btnSep.className = "px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white shadow flex items-center gap-1.5 transition";
                btnAll.className = "px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white flex items-center gap-1.5 transition";
            } else {
                secSep.classList.add('hidden');
                secAll.classList.remove('hidden');
                btnAll.className = "px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white shadow flex items-center gap-1.5 transition";
                btnSep.className = "px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white flex items-center gap-1.5 transition";
            }
        }

        // Render All Vehicles in Isolated Side-by-Side Cards
        function renderAllVehiclesGrid() {
            const grid = document.getElementById('all-vehicles-separated-grid');
            grid.innerHTML = vehicles.map(veh => {
                const vMaints = maintenanceLogs.filter(m => m.vehId === veh.id);
                const vFuels = fuelLogs.filter(f => f.vehId === veh.id);
                const vExps = expenseLogs.filter(e => e.vehId === veh.id);
                const totalMaint = vMaints.reduce((acc, m) => acc + (m.partCost + m.laborCost), 0);
                const totalFuel = vFuels.reduce((acc, f) => acc + f.cost, 0);
                const totalExp = vExps.reduce((acc, e) => acc + e.amount, 0);
                const totalCost = totalMaint + totalFuel + totalExp;

                const maintRows = vMaints.map(m => `
                    <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between text-xs">
                        <div>
                            <div class="font-bold text-slate-800">${m.desc}</div>
                            <div class="text-[11px] text-slate-400 mt-0.5">${m.date} • ${m.mileage.toLocaleString()} km • ${m.shop}</div>
                        </div>
                        <span class="font-mono font-bold text-indigo-700">${formatMoney(m.partCost + m.laborCost)}</span>
                    </div>
                `).join('') || '<p class="text-xs text-slate-400 italic py-2">目前無保養紀錄</p>';

                return `
                    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                        <!-- Card Header -->
                        <div class="p-4 bg-slate-900 text-white flex items-center justify-between">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-300 text-lg">
                                    <i class="${veh.icon}"></i>
                                </div>
                                <div>
                                    <div class="flex items-center gap-2">
                                        <span class="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[11px] font-bold font-mono">${veh.id}</span>
                                        <h3 class="font-black text-sm sm:text-base">${veh.name}</h3>
                                    </div>
                                    <p class="text-xs text-slate-400 font-mono">${veh.plate} • ${veh.model}</p>
                                </div>
                            </div>
                            <div class="text-right">
                                <p class="text-[10px] text-slate-400">總花費</p>
                                <p class="font-mono font-bold text-amber-400 text-sm">${formatMoney(totalCost)}</p>
                            </div>
                        </div>

                        <!-- Card Stats Bar -->
                        <div class="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100 bg-slate-50/50 p-2 text-center text-xs">
                            <div>
                                <span class="text-slate-400 text-[10px] block">保養花費</span>
                                <span class="font-bold text-indigo-700 font-mono">${formatMoney(totalMaint)}</span>
                            </div>
                            <div>
                                <span class="text-slate-400 text-[10px] block">燃油油資</span>
                                <span class="font-bold text-amber-600 font-mono">${formatMoney(totalFuel)}</span>
                            </div>
                            <div>
                                <span class="text-slate-400 text-[10px] block">稅費保險</span>
                                <span class="font-bold text-emerald-600 font-mono">${formatMoney(totalExp)}</span>
                            </div>
                        </div>

                        <!-- Card Body: Isolated Maintenance List -->
                        <div class="p-4 flex-grow space-y-3">
                            <div class="flex items-center justify-between">
                                <span class="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                    <i class="fa-solid fa-wrench text-blue-600"></i> 保養維修歷史紀錄 (${vMaints.length} 筆)
                                </span>
                                <span class="text-[11px] text-slate-400">當前里程: ${veh.mileage.toLocaleString()} km</span>
                            </div>
                            <div class="space-y-2">
                                ${maintRows}
                            </div>
                        </div>

                        <!-- Card Footer Action -->
                        <div class="p-3 bg-slate-50 border-t border-slate-100 text-right">
                            <button onclick="switchMainView('separated'); selectVehicle('${veh.id}');" class="text-xs font-bold text-blue-600 hover:text-blue-800 transition flex items-center gap-1 ml-auto">
                                進入該車完整獨立面板 <i class="fa-solid fa-chevron-right text-[10px]"></i>
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
        }

        document.addEventListener('DOMContentLoaded', initApp);
    </script>
</body>
</html>
