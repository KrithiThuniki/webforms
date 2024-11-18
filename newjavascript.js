

var jpdbBaseURL = 'http://api.login2explore.com:5577';
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var empDBName = "EMP-DB";
var empRelationName = "EmpData";
var connToken = "90934447|-31949228959528298|90956922";

$(document).ready(function () {
    $("#empid").focus();
    resetForm();
});

function saveRecNo2LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
}

function getEmpIdAsJsonObj() {
    var empid = $("#empid").val();
    return JSON.stringify({ id: empid });
}

function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var record = jsonObj.data;
    $("#empname").val(record.name);
    $("#empsal").val(record.salary);
    $("#hra").val(record.hra);
    $("#da").val(record.da);
    $("#deduct").val(record.deduction);
}

function resetForm() {
    $("#empid").val("");
    $("#empname").val("");
    $("#empsal").val("");
    $("#hra").val("");
    $("#da").val("");
    $("#deduct").val("");
    $("#empid").prop("disabled", false);
    $("#save").prop("disabled", true);
    $("#change").prop("disabled", true);
    $("#reset").prop("disabled", true);
    $("#empid").focus();
}

function validateData() {
    var empid = $("#empid").val();
    var empname = $("#empname").val();
    var empsal = $("#empsal").val();
    var hra = $("#hra").val();
    var da = $("#da").val();
    var deduct = $("#deduct").val();

    if (!empid || !empname || !empsal || !hra || !da || !deduct) {
        alert("All fields are required!");
        return "";
    }
    if (empsal <= 0 || hra < 0 || da < 0 || deduct < 0) {
        alert("Invalid numeric values!");
        return "";
    }

    return JSON.stringify({
        id: empid,
        name: empname,
        salary: empsal,
        hra: hra,
        da: da,
        deduction: deduct
    });
}

function getEmp() {
    var empIdJsonObj = getEmpIdAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, empDBName, empRelationName, empIdJsonObj);
    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({ async: true });

    if (resJsonObj.status === 400) {
        $("#save").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#empname").focus();
    } else if (resJsonObj.status === 200) {
        $("#empid").prop("disabled", true);
        fillData(resJsonObj);
        $("#change").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#empname").focus();
    }
}

function saveData() {
    var jsonStrObj = validateData();
    if (!jsonStrObj) return;

    var putRequest = createPUTRequest(connToken, jsonStrObj, empDBName, empRelationName);

    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({ async: true });

    alert("Data saved successfully!");
    resetForm();
}

function changeData() {
    var jsonChg = validateData();
    if (!jsonChg) return;

    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, empDBName, empRelationName, localStorage.getItem("recno"));

    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({ async: true });

    alert("Data updated successfully!");
    resetForm();
}
