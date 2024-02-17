const { retryForActions, clickAfterClickable } = require('./api')

// 1. 다모아접속
async function pageInit(page, reqData) {
  const returnData = {
    err: false,
    msg: {},
  }
  try {
    await page.waitForTimeout(100)
    const damoaInit = async () => {
      await page.goto('https://www.e-insmarket.or.kr/m/intro.knia', {
        timeout: 8000,
      })
      await clickAfterClickable(
        page,
        `#contents_scroll > div.product_banner > ul.img_banner > li.img01 > a`,
        8000
      )
      await clickAfterClickable(
        page,
        `#contents_scroll > div > ul > li:nth-child(1) > a`,
        8000
      )
      await clickAfterClickable(page, `#agreeAll`, 8000)
      await clickAfterClickable(
        page,
        `#searchForm > ul > li:nth-child(2) > div > div > button:nth-child(2)`,
        8000
      )
      await clickAfterClickable(page, `#agreeChkAll`, 8000)
      await clickAfterClickable(page, `#agreeChk5`, 8000)
    }

    if (await retryForActions(page, damoaInit)) {
      returnData.err = true
      return returnData
    }

    returnData.msg.success = true
  } catch (err) {
    console.log(err)
    returnData.err = true
  }
  return returnData
}

module.exports = {
  pageInit,
}
