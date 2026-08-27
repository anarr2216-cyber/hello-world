/**
 * Google Apps Script 雲端試算表自動同步後端 (支援車輛與紀錄 CRUD)
 */

function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('車輛清單') || ss.getActiveSheet();
  var data = sheet.getDataRange().getValues();
  return ContentService.createTextOutput(JSON.stringify({ status: "success", data: data }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var action = body.action;
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    if (action === "SYNC_VEHICLES") {
      var sheet = ss.getSheetByName('車輛清單');
      if (!sheet) {
        sheet = ss.insertSheet('車輛清單');
      } else {
        sheet.clear();
      }
      sheet.appendRow(["車輛代號", "車輛名稱", "車牌號碼", "車輛類型", "廠牌型號", "年份", "目前里程(km)", "圖示"]);
      var vehList = body.data;
      for (var i = 0; i < vehList.length; i++) {
        var v = vehList[i];
        sheet.appendRow([v.id, v.name, v.plate, v.type, v.model, v.year, v.mileage, v.icon]);
      }
      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "車輛資料庫同步成功！" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    if (action === "ADD_MAINTENANCE") {
      var sheet = ss.getSheetByName('保養維修紀錄');
      if (!sheet) {
        sheet = ss.insertSheet('保養維修紀錄');
        sheet.appendRow(["紀錄編號", "保養日期", "車輛代號", "保養里程(km)", "主分類", "保養項目", "零件費用", "工資費用", "總費用", "下次里程", "店家", "備註"]);
      }
      var d = body.data;
      var total = Number(d.partCost) + Number(d.laborCost);
      sheet.appendRow([d.id, d.date, d.vehId, d.mileage, d.cat, d.desc, d.partCost, d.laborCost, total, d.nextMileage, d.shop, d.note]);
      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "保養紀錄已成功同步！" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    if (action === "ADD_FUEL") {
      var sheet = ss.getSheetByName('加油油耗紀錄');
      if (!sheet) {
        sheet = ss.insertSheet('加油油耗紀錄');
        sheet.appendRow(["加油日期", "車輛代號", "目前里程", "單趟里程", "油品種類", "單價", "加油量", "金額", "油耗", "每公里油資", "備註"]);
      }
      var f = body.data;
      sheet.appendRow([f.date, f.vehId, f.meter, f.trip, f.fuelType, f.unitPrice, f.volume, f.cost, f.kml, f.costPerKm, f.note]);
      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "加油紀錄已成功同步！" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "未知操作" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
