import './style.css'
import { sampleApp } from './modules/sampleApp'
import { defaultSetup } from './modules/control'
import { restoreAppData, dataInStorage, storeAppData } from './modules/storage'

function init() {
    let app
    if (dataInStorage()) {
        app = restoreAppData()
    } else {
        app = sampleApp()
        storeAppData(app)
    }
    defaultSetup(app)
}

init()