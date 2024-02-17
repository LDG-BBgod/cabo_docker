const { retryForActions, waitForBlockUIVisible } = require('./api')

// 1. 갱신(기존)차량 조회
async function getExistCar(page, reqData) {
  const returnData = {
    err: false,
    msg: {},
  }
  try {
    await page.waitForTimeout(100)
    const clickSearchButton = async () => {
      await page.click(
        `#tabs-1 > div.con_new > div.fbtn_area02.flex_area > button`
      )
    }
    if (await retryForActions(page, clickSearchButton)) {
      returnData.err = true
      return returnData
    }

    await waitForBlockUIVisible(page)

    const isExistCar = await page.evaluate(() => {
      const style = window.getComputedStyle(
        document.querySelector('div.car30product_list')
      )
      return style.display === 'none' ? false : true
    })

    if (isExistCar) {
      // 갱신차량이 존재하는경우
      returnData.msg.data = []
      const liCount = await page.evaluate(() => {
        return document.querySelector('#tabs-1 > div.car30product_list > ul')
          .children.length
      })

      for (let i = 1; i <= liCount; i++) {
        const tempDataObj = await page.evaluate((index) => {
          const company = document.querySelector(
            `#tabs-1 > div.car30product_list > ul > li:nth-child(${index}) > div > div.name`
          ).textContent
          const carNumName = document.querySelector(
            `#tabs-1 > div.car30product_list > ul > li:nth-child(${index}) > div > div.src > span.car_num`
          ).textContent
          const carName = document.querySelector(
            `#tabs-1 > div.car30product_list > ul > li:nth-child(${index}) > div > div.src > span.car_num > em`
          ).textContent
          const endDate = document.querySelector(
            `#tabs-1 > div.car30product_list > ul > li:nth-child(${index}) > div > div.src > span.car_insudate`
          ).textContent
          return { company, carNumName, carName, endDate }
        }, i)
        returnData.msg.data.push(tempDataObj)
      }
    }

    returnData.msg.success = true
  } catch (err) {
    returnData.err = true
  }
  return returnData
}

// 2. 갱신(기존)차량 선택
async function selectExistCar(page, reqData) {
  const returnData = {
    err: false,
    msg: {},
  }
  try {
    await page.waitForTimeout(100)
    const { selectedCar } = reqData
    const clickSearchButton = async () => {
      await page.click(
        `#tabs-1 > div.car30product_list > ul > li:nth-child(${selectedCar}) > div > div.btn_area > button:nth-child(1)`
      )
    }
    if (await retryForActions(page, clickSearchButton)) {
      returnData.err = true
      return returnData
    }
    await waitForBlockUIVisible(page)

    returnData.msg.success = true
  } catch (err) {
    returnData.err = true
  }
  return returnData
}

// 3. 신규 계약 선택
async function newContract(page, reqData) {
  const returnData = {
    err: false,
    msg: {},
  }
  try {
    await page.waitForTimeout(100)
    const clickNewButton = async () => {
      await page.click(`#ui-id-2`)
      await page.waitForSelector(
        '#tabs-2 > div > div.fbtn_area02.flex_area > button'
      )
      await page.click(`#tabs-2 > div > div.fbtn_area02.flex_area > button`)
    }

    if (await retryForActions(page, clickNewButton)) {
      returnData.err = true
      return returnData
    }
    await waitForBlockUIVisible(page)

    returnData.msg.success = true
  } catch (err) {
    returnData.err = true
  }
  return returnData
}

module.exports = {
  getExistCar,
  selectExistCar,
  newContract,
}
