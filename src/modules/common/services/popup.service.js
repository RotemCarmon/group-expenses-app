import { utilService } from "./util.service";
import { loggerService } from './logger.service';

const elAlertContainer = document.createElement('div');
elAlertContainer.classList.add('alert-container');
document.body.appendChild(elAlertContainer);
var idTimeoutMap = {}



export const popupService = {
    success,
    error,
    confirm,
    warn,
    info
};

var gConfirmShowing = null

function confirm({title, txt, approveTxt = 'ok', cancelTxt = 'cancel'}) {
    return new Promise((resolve) => {
        const msg = { status: 'confirm',title, txt, approveTxt, cancelTxt };
        elAlertContainer.classList.add('full-screen');
        _showConfirm(msg, resolve);
    })
}

function success(txt, time) {
    const msg = { status: 'success', txt };
    _showAlert(msg, time);
}

function error(txt, err, time) {
    loggerService.error(err);
    const msg = { status: 'error', txt };
    _showAlert(msg, time);
}

function warn(txt, time) {
    const msg = { status: 'warn', txt };
    _showAlert(msg, time);
}

function info(txt, time) {
    const msg = { status: 'info', txt };
    _showAlert(msg, time);
}

function _showConfirm(msg, cb) {
    const id = utilService.makeId();
    gConfirmShowing = id
    const elConfirm = createConfirm(msg, id, cb);
    elAlertContainer.appendChild(elConfirm);
}

function _showAlert(msg, time = 3000) {
    if (gConfirmShowing) {
        elAlertContainer.classList.remove('full-screen');
        const elConfirm = document.getElementById(gConfirmShowing);
        elConfirm.classList.remove('leave');
        elConfirm.remove();
    }
    const id = utilService.makeId();
    const elAlert = createAlert(msg, id);
    elAlertContainer.appendChild(elAlert);

    if (time !== null) {
        let alertTimeout = setTimeout(() => {
            closeAlert(id);
        }, time);

        idTimeoutMap[id] = alertTimeout
    }
}



function closeAlert(id, isFullScreen = false) {
    clearTimeout(idTimeoutMap[id])
    delete idTimeoutMap[id]

    const elAlert = document.getElementById(id);
    elAlert.classList.add('leave')
    setTimeout(() => {
        if (isFullScreen) elAlertContainer.classList.remove('full-screen');
        elAlert.classList.remove('leave');
        if (elAlert) elAlert.remove();
        gConfirmShowing = null
    }, 400)
}

function createAlert(msg, id) {
    const elAlert = document.createElement('div');
    elAlert.className = `alert ${msg.status}`;
    elAlert.id = id;
    elAlert.dataset.testid = 'alert'
    
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
    elAlert.dataset.testid = 'confirm'


    var elTitle = document.createElement('h3');
    var elTxt = document.createElement('p');
    elTitle.innerText = msg.title;
    elTxt.innerText = msg.txt;


    const elBtns = _createBtns(msg, id, cb)

    elAlert.appendChild(elTitle);
    elAlert.appendChild(elTxt);
    elAlert.appendChild(elBtns);
    return elAlert;
}


function _createBtns(msg, id, cb) {

    var elCancelBtn = document.createElement('button');
    elCancelBtn.className = 'cancel-btn';
    elCancelBtn.innerText = msg.cancelTxt;
    elCancelBtn.dataset.testid = 'cancel-btn'
    elCancelBtn.onclick = () => {
        cb(false)
        closeAlert(id, true)
    }
    
    var elApproveBtn = document.createElement('button');
    elApproveBtn.className = 'approve-btn';
    elApproveBtn.innerText = msg.approveTxt;
    elApproveBtn.dataset.testid = 'approve-btn'
    elApproveBtn.onclick = () => {
        cb(true)
        closeAlert(id, true)
    }

    var elBtns = document.createElement('div');
    elBtns.classList.add('confirm-action-btns')

    elBtns.appendChild(elApproveBtn)
    elBtns.appendChild(elCancelBtn)

    return elBtns
}