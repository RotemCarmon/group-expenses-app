import { utilService } from "./util.service";
import { $t } from '@/plugins/i18n.js';
import { loggerService } from './logger.service';

const elAlertContainer = document.createElement('div');
elAlertContainer.classList.add('alert-container');
document.body.appendChild(elAlertContainer);
var idTimeoutMap = {}



export const popupService = {
    success,
    error,
    confirm
};

function confirm(key, approveTxt = 'ok', cancelTxt = 'cancel') {
    return new Promise((resolve) => {
        let txt = $t(key);
        approveTxt = $t(approveTxt);
        cancelTxt = $t(cancelTxt);

        const msg = { status: 'confirm', txt, approveTxt, cancelTxt };
        elAlertContainer.classList.add('full-screen');
        _showConfirm(msg, resolve);
    })
}

function success(key, time) {
    let txt = $t(key);
    const msg = { status: 'success', txt };
    _showAlert(msg, time);
}

function error(key, err) {
    let txt = $t(key);
    loggerService.error(err);
    const msg = { status: 'error', txt };
    _showAlert(msg);
}

function _showConfirm(msg, cb) {
    const id = utilService.makeId();
    const elConfirm = createConfirm(msg, id, cb);
    elAlertContainer.appendChild(elConfirm);
}

function _showAlert(msg, time = 3000) {
    const id = utilService.makeId();
    const elAlert = createAlert(msg, id);
    elAlertContainer.appendChild(elAlert);
    let alertTimeout = setTimeout(() => {
        closeAlert(id);
    }, time);
    idTimeoutMap[id] = alertTimeout
}



function closeAlert(id) {
    clearTimeout(idTimeoutMap[id])
    delete idTimeoutMap[id]

    const elAlert = document.getElementById(id);
    elAlert.classList.add('leave')
    setTimeout(() => {
        elAlertContainer.classList.remove('full-screen');
        elAlert.classList.remove('leave');
        if (elAlert) elAlert.remove();
    }, 400)
}

function createAlert(msg, id) {
    const elAlert = document.createElement('div');
    elAlert.className = `alert ${msg.status}`;
    elAlert.id = id;

    var elTxt = document.createElement('p');
    elTxt.innerText = msg.txt;

    var elCloseBtn = document.createElement('button');
    elCloseBtn.className = 'close-btn';
    elCloseBtn.innerText = 'X';
    elCloseBtn.onclick = () => closeAlert(id);

    elAlert.appendChild(elTxt);
    elAlert.appendChild(elCloseBtn);

    return elAlert;
}

function createConfirm(msg, id, cb) {
    const elAlert = document.createElement('div');
    elAlert.className = `alert ${msg.status}`;
    elAlert.id = id;


    var elTxt = document.createElement('p');
    elTxt.innerText = msg.txt;


    const elBtns = _createBtns(msg, id, cb)

    elAlert.appendChild(elTxt);
    elAlert.appendChild(elBtns);
    return elAlert;
}


function _createBtns(msg, id, cb) {

    var elCancelBtn = document.createElement('button');
    elCancelBtn.className = 'cancel-btn';
    elCancelBtn.innerText = msg.cancelTxt;
    elCancelBtn.onclick = () => {
        cb(false)
        closeAlert(id)
    }

    var elApproveBtn = document.createElement('button');
    elApproveBtn.className = 'approve-btn';
    elApproveBtn.innerText = msg.approveTxt;
    elApproveBtn.onclick = () => {
        cb(true)
        closeAlert(id)
    }

    var elBtns = document.createElement('div');
    elBtns.classList.add('action-btns')

    elBtns.appendChild(elCancelBtn)
    elBtns.appendChild(elApproveBtn)

    return elBtns
}