const express = require('express')
const cors = require('cors')
const puppeteer = require('puppeteer')

const {
  Step0,
  Step1,
  Step2,
  Step3,
  Step4,
  Step5,
} = require('./puppeteer/index')

const app = express()
const PORT = 10000
const corsOptions = {
  origin: '*',
}

app.use(express.json())
app.use(cors(corsOptions))

let page
const createPuppeteer = async () => {
  const option = {
    headless: false,
    args: [
      '--incognito',
      '--no-zygote',
      '--mute-audio',
      '--no-sandbox',
      '--disable-gpu',
      '--no-first-run',
      '--single-process',
      '--hide-scrollbars',
      '--disable-breakpad',
      '--disable-infobars',
      '--disable-extensions',
      '--disable-dev-shm-usage',
      '--disable-notifications',
      '--disable-dev-shm-usage',
      '--metrics-recording-only',
      '--disable-setuid-sandbox',
      '--force-color-profile=srgb',
      '--ignore-certificate-errors',
      '--disable-accelerated-2d-canvas',
      '--disable-renderer-backgrounding',
      '--disable-ipc-flooding-protection',
      '--ignore-certificate-errors-skip-list',
      '--disable-background-timer-throttling',
      '--disable-features=AutomationControlled',
      '--disable-backgrounding-occluded-windows',
      '--disable-component-extensions-with-background-pages',
      '--disable-features=TranslateUI,BlinkGenPropertyTrees',
      '--enable-features=NetworkService,NetworkServiceInProcess',
    ],
  }
  // 배포용
  const browser = await puppeteer.launch(option)
  // 테스트용 현재창크롬
  // const browser = await puppeteer.connect({
  //   browserURL: 'http://localhost:9222',
  // })
  const pages = await browser.pages()
  page = pages[0]
  page.on('popup', (newPage) => {
    newPage.close()
  })
  console.log('연결성공')
}
createPuppeteer()

// step0
app.post('/pageInit', async (req, res) => {
  console.log('/pageInit')
  const { err, msg } = await Step0.pageInit(page, req.body)
  res.send({ err, msg })
})

// step1
app.post('/getSixNum', async (req, res) => {
  console.log('/getSixNum')
  const { err, msg } = await Step1.getSixNum(page, req.body)
  res.send({ err, msg })
})

app.post('/reGetSixNum', async (req, res) => {
  console.log('/reGetSixNum')
  const { err, msg } = await Step1.reGetSixNum(page, req.body)
  res.send({ err, msg })
})

app.post('/authSixNum', async (req, res) => {
  console.log('/authSixNum')
  const { err, msg } = await Step1.authSixNum(page, req.body)
  res.send({ err, msg })
})

// step2
app.post('/getExistCar', async (req, res) => {
  console.log('/getExistCar')
  const { err, msg } = await Step2.getExistCar(page, req.body)
  res.send({ err, msg })
})

app.post('/selectExistCar', async (req, res) => {
  console.log('/selectExistCar')
  const { err, msg } = await Step2.selectExistCar(page, req.body)
  res.send({ err, msg })
})

app.post('/newContract', async (req, res) => {
  console.log('/newContract')
  const { err, msg } = await Step2.newContract(page, req.body)
  res.send({ err, msg })
})

// step3
app.post('/newCarSelect', async (req, res) => {
  console.log('/newCarSelect')
  const { err, msg } = await Step3.newCarSelect(page, req.body)
  res.send({ err, msg })
})

// step4
app.post('/getExistCarInfo', async (req, res) => {
  console.log('/getExistCarInfo')
  const { err, msg } = await Step4.getExistCarInfo(page, req.body)
  res.send({ err, msg })
})
app.post('/selectExistContractInfo', async (req, res) => {
  console.log('/selectExistContractInfo')
  const { err, msg } = await Step4.selectExistContractInfo(page, req.body)
  res.send({ err, msg })
})
app.post('/selectNewContractInfo', async (req, res) => {
  console.log('/selectNewContractInfo')
  const { err, msg } = await Step4.selectNewContractInfo(page, req.body)
  res.send({ err, msg })
})
app.post('/selectAddCarInfo', async (req, res) => {
  console.log('/selectAddCarInfo')
  const { err, msg } = await Step4.selectAddCarInfo(page, req.body)
  res.send({ err, msg })
})
app.post('/goResultStep', async (req, res) => {
  console.log('/goResultStep')
  const { err, msg } = await Step5.goResultStep(page, req.body)
  res.send({ err, msg })
})
app.post('/getResult', async (req, res) => {
  console.log('/getResult')
  const { err, msg } = await Step5.getResult(page, req.body)
  res.send({ err, msg })
})

app.use((err, req, res, next) => {
  res.statusCode = err.statusCode || 500
  res.send(err.message)
})

app.listen(PORT, () => {
  console.log(`PORT = ${PORT}`)
})
