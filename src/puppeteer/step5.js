const fs = require('fs')
const path = require('path')
const { PNG } = require('pngjs')
const pixelmatch = require('pixelmatch')

const {
  waitForBlockUIVisible,
  retryForActions,
  clickAfterClickable,
  typeAfterVisible,
  selectAfterVisible,
  getText,
} = require('./api')

async function goResultStep(page, reqData) {
  await page.waitForTimeout(100)
  const returnData = {
    err: false,
    msg: {},
  }
  try {
    await clickAfterClickable(
      page,
      '#contents_scroll > div.product_search > div.join_info2 > div.fbtn_area.flex_area > button'
    )
    await waitForBlockUIVisible(page)

    // 입력 오류 체크
    const elements = await page
      .evaluate(() => {
        const target = document
          .getElementsByClassName('ui-dialog')[0]
          .getElementsByClassName('ui-dialog-content')[0]
        return target.textContent
      })
      .catch(() => {
        return false
      })
    if (elements) {
      await page.evaluate(() => {
        document.querySelectorAll('.ui-dialog').forEach((element) => {
          element.parentNode.removeChild(element)
        })
        document.querySelectorAll('.ui-widget-overlay').forEach((element) => {
          element.parentNode.removeChild(element)
        })
      })
      returnData.msg = {
        success: false,
        data: elements,
      }
      return returnData
    }

    await waitForBlockUIVisible(page)

    returnData.msg.success = true
  } catch (err) {
    returnData.err = true
  }
  return returnData
}

async function getResult(page, reqData) {
  await page.waitForTimeout(100)
  const returnData = {
    err: false,
    msg: {},
  }
  let existData = []
  let vsData = []
  try {
    const liCount = await page.evaluate(() => {
      const parentElement = document.querySelector(
        '#searchResult4 > div.product_list > ul'
      )
      return parentElement.children.length
    })
    if (liCount === 11) {
      // 기존 이미지 변수 생성
      for (let i = 1; i <= 11; i++) {
        const existFilePath = path.join(__dirname, 'vsImg', `INSU${i}.png`)
        const logoImg = PNG.sync.read(fs.readFileSync(existFilePath))
        existData.push({
          logoImg,
          name: `INSU${i}`,
        })
      }
      // 결과 이미지 및 데이터 변수 생성
      for (let i = 1; i <= 11; i++) {
        let moneyEL = null
        let laterOptionMoneyEL = null
        let firstOptionMoneyEL = null
        let money = ''
        let laterOptionMoney = ''
        let firstOptionMoney = ''
        let mileList = []
        // 이미지 스크린샷
        const imgEL = await page.$(
          `#searchResult4 > div.product_list > ul > li:nth-child(${i}) > div.product_area > div.logo`
        )
        const imgBase64 = await imgEL.screenshot({ encoding: 'base64' })
        const logoImg = PNG.sync.read(Buffer.from(imgBase64, 'base64'))

        moneyEL = await page.$(
          `#searchResult4 > div.product_list > ul > li:nth-child(${i}) > div.product_area > div.src > span > span:nth-child(1) > span.price > strong`
        )

        if (moneyEL !== null) {
          // 예상 납입 보험료
          money = await getText(page, moneyEL)

          // 마일리지 적용후 선납, 후납 예상 납입 보험료
          const divCount = await page.evaluate((index) => {
            const parentElement = document.querySelector(
              `#searchResult4 > div.product_list > ul > li:nth-child(${index}) > div.product_area > div.src > span > span:nth-child(2) > span.price`
            )
            return parentElement.children.length
          }, i)
          if (divCount === 1) {
            laterOptionMoneyEL = await page.$(
              `#searchResult4 > div.product_list > ul > li:nth-child(${i}) > div.product_area > div.src > span > span:nth-child(2) > span.price > strong`
            )
            laterOptionMoney = await getText(page, laterOptionMoneyEL)
          } else {
            firstOptionMoneyEL = await page.$(
              `#searchResult4 > div.product_list > ul > li:nth-child(${i}) > div.product_area > div.src > span > span:nth-child(2) > span.price > div:nth-child(1) > strong`
            )
            laterOptionMoneyEL = await page.$(
              `#searchResult4 > div.product_list > ul > li:nth-child(${i}) > div.product_area > div.src > span > span:nth-child(2) > span.price > div:nth-child(2) > strong`
            )
            firstOptionMoney = await getText(page, firstOptionMoneyEL)
            laterOptionMoney = await getText(page, laterOptionMoneyEL)
          }

          // 적용되는 마일리지 종류
          const mileCount = await page.evaluate((index) => {
            const parentElement = document.querySelector(
              `#searchResult4 > div.product_list > ul > li:nth-child(${index}) > div.imgIcon > ul`
            )
            return parentElement.children.length
          }, i)
          for (let j = 1; j <= mileCount; j++) {
            const mileEL = await page.$(`
            #searchResult4 > div.product_list > ul > li:nth-child(${i}) > div.imgIcon > ul > img:nth-child(${j})`)
            const mile = await page.evaluate((element) => {
              return element.getAttribute('title')
            }, mileEL)
            mileList.push(mile)
          }
        }
        vsData.push({
          logoImg,
          money: money === '' ? money : money.substring(0, money.length - 1),
          firstOptionMoney:
            firstOptionMoney === ''
              ? firstOptionMoney
              : firstOptionMoney.substring(0, firstOptionMoney.length - 7),
          laterOptionMoney:
            laterOptionMoney === ''
              ? laterOptionMoney
              : laterOptionMoney.substring(0, laterOptionMoney.length - 7),
          mileList,
        })
      }

      // 이미지 비교하여 회사 특정 및 전송 데이터 정렬
      for (let i = 0; i < 11; i++) {
        const diff = new PNG({
          width: vsData[i].logoImg.width,
          height: vsData[i].logoImg.height,
        })
        for (let j = 0; j < 11; j += 1) {
          const mismatchedPixels = pixelmatch(
            vsData[i].logoImg.data,
            existData[j].logoImg.data,
            diff.data,
            vsData[i].logoImg.width,
            vsData[i].logoImg.height
          )
          if (mismatchedPixels < 200) {
            vsData[i].name = existData[j].name
            delete vsData[i].logoImg
            break
          }
        }
      }
    }
    returnData.msg.data = vsData
    returnData.msg.success = true
  } catch (err) {
    console.log(err)
    returnData.err = true
  }
  return returnData
}

module.exports = {
  goResultStep,
  getResult,
}
