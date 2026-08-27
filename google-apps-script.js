function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var vehSheet = ss.getSheetByName('車輛清單');
    var vehicles = [];
    if (vehSheet && vehSheet.getLastRow() > 1) {
      vehicles = vehSheet.getRange(2, 1, vehSheet.getLastRow() - 1, 8).getValues().map(function(r) {
        return { id: r[0], name: r[1], plate: r[2], type: r[3], model: r[4], year: r[5], mileage: Number(r[6]) || 0, icon: r[7] || "fa-solid fa-car-side" };
      });
    }

    var maintSheet = ss.getSheetByName('保養維修紀錄');
    var maintenance = [];
    if (maintSheet && maintSheet.getLastRow() > 1) {
      maintenance = maintSheet.getRange(2, 1, maintSheet.getLastRow() - 1, 12).getValues().map(function(r) {
        return { id: r[0], date: Utilities.formatDate(new Date(r[1]), Session.getScriptTimeZone(), "yyyy-MM-dd"), vehId: r[2], mileage: Number(r[3]) || 0, cat: r[4], desc: r[5], partCost: Number(r[6]) || 0, laborCost: Number(r[7]) || 0, nextMileage: Number(r[9]) || 0, shop: r[10] || "", note: r[11] || "" };
      });
    }

    var fuelSheet = ss.getSheetByName('加油油耗紀錄');
    var fuel = [];
    if (fuelSheet && fuelSheet.getLastRow() > 1) {
      fuel = fuelSheet.getRange(2, 1, fuelSheet.getLastRow() - 1, 11).getValues().map(function(r) {
        return { date: Utilities.formatDate(new Date(r[0]), Session.getScriptTimeZone(), "yyyy-MM-dd"), vehId: r[1], meter: Number(r[2]) || 0, trip: Number(r[3]) || 0, fuelType: r[4], unitPrice: Number(r[5]) || 0, volume: Number(r[6]) || 0, cost: Number(r[7]) || 0, kml: Number(r[8]) || 0, costPerKm: Number(r[9]) || 0, note: r[10] || "" };
      });
    }

    return ContentService.createTextOutput(JSON.stringify({ status: "success", data: { vehicles: vehicles, maintenance: maintenance, fuel: fuel } })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var action = body.action;
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    if (action === "SYNC_VEHICLES") {
      var sheet = ss.getSheetByName('車輛清單') || ss.insertSheet('車輛清單');
      sheet.clear();
      sheet.appendRow(["車輛代號", "車輛名稱", "車牌號碼", "車輛類型", "廠牌型號", "年份", "目前里程(km)", "圖示"]);
      var list = body.data || [];
      for (var i = 0; i < list.length; i++) {
        var v = list[i];
        sheet.appendRow([v.id, v.name, v.plate, v.type, v.model, v.year, v.mileage, v.icon]);
      }
      return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
    }

    if (action === "ADD_MAINTENANCE") {
      var sheet = ss.getSheetByName('保養維修紀錄') || ss.insertSheet('保養維修紀錄');
      if (sheet.getLastRow() === 0) {
        sheet.appendRow(["紀錄編號", "保養日期", "車輛代號", "保養里程(km)", "主分類", "保養項目", "零件費用", "工資費用", "總費用", "下次里程", "店家", "備註"]);
      }
      var d = body.data;
      var total = Number(d.partCost) + Number(d.laborCost);
      sheet.appendRow([d.id, d.date, d.vehId, d.mileage, d.cat, d.desc, d.partCost, d.laborCost, total, d.nextMileage, d.shop, d.note]);
      
      var vSheet = ss.getSheetByName('車輛清單');
      if (vSheet && vSheet.getLastRow() > 1) {
        var vData = vSheet.getRange(2, 1, vSheet.getLastRow() - 1, 7).getValues();
        for (var j = 0; j < vData.length; j++) {
          if (vData[j][0] === d.vehId && Number(d.mileage) > Number(vData[j][6])) {
            vSheet.getRange(j + 2, 7).setValue(d.mileage);
          }
        }
      }
      return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
    }

    if (action === "ADD_FUEL") {
      var sheet = ss.getSheetByName('加油油耗紀錄') || ss.insertSheet('加油油耗紀錄');
      if (sheet.getLastRow() === 0) {
        sheet.appendRow(["加油日期", "車輛代號", "目前里程", "單趟里程", "油品種類", "單價", "加油量", "金額", "油耗", "每公里油資", "備註"]);
      }
      var f = body.data;
      sheet.appendRow([f.date, f.vehId, f.meter, f.trip, f.fuelType, f.unitPrice, f.volume, f.cost, f.kml, f.costPerKm, f.note]);
      return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "未知指令" })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}
