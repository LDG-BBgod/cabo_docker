const { retryForActions, waitForBlockUIVisible } = require('./api')

const selectCarOptionCorrect = async (page, name, value) => {
  await page.evaluate(
    (nameString, valueSring) => {
      const inputs = document.getElementsByName(nameString)
      console.log(inputs)
      for (const input of inputs) {
        if (input.value === valueSring) {
          input.click()
        }
      }
    },
    name,
    value
  )
}
const selectCarOptionIncludes = async (page, name, value) => {
  await page.evaluate(
    (nameString, valueSring) => {
      console.log('내부함수 진입')
      const inputs = document.getElementsByName(nameString)
      console.log(inputs)
      for (const input of inputs) {
        if (input.value.includes(valueSring)) {
          input.click()
        }
      }
    },
    name,
    value
  )
}
// 1. 차량선택 (오류 예외처리 강화기)
async function newCarSelect(page, reqData) {
  const returnData = {
    err: false,
    msg: {},
  }
  try {
    await page.waitForTimeout(100)
    const { carOption1, carOption2, carOption3, carOption4, carOption5 } =
      reqData

    // 제조사 선택
    await page.click(`#newcar_item_1 > div > div.acc_head`)
    await waitForBlockUIVisible(page)

    const clickCarOption1 = async () => {
      await selectCarOptionCorrect(page, 'iMaker', carOption1)
      await waitForBlockUIVisible(page)
    }
    if (await retryForActions(page, clickCarOption1)) {
      returnData.err = true
      return returnData
    }

    // 자동차명 선택
    const clickCarOption2 = async () => {
      await selectCarOptionCorrect(page, 'iCarName', carOption2)
      await waitForBlockUIVisible(page)
    }
    if (await retryForActions(page, clickCarOption2)) {
      returnData.err = true
      return returnData
    }

    // 등록년도 선택
    const clickCarOption3 = async () => {
      await selectCarOptionIncludes(page, 'iMadeym', carOption3)
      await waitForBlockUIVisible(page)
    }
    if (await retryForActions(page, clickCarOption3)) {
      returnData.err = true
      return returnData
    }

    // 세부차명 선택
    const clickCarOption4 = async () => {
      await selectCarOptionCorrect(page, 'iCarNameDtl', carOption4)
      await waitForBlockUIVisible(page)
    }
    if (await retryForActions(page, clickCarOption4)) {
      returnData.err = true
      return returnData
    }

    // 세부항목 선택
    const clickCarOption5 = async () => {
      await selectCarOptionIncludes(page, 'iOptionDtl', carOption5)
    }
    if (await retryForActions(page, clickCarOption5)) {
      returnData.err = true
      return returnData
    }

    const navigationPromise = page.waitForNavigation({
      waitUntil: 'networkidle0',
    })
    await Promise.all([page.click('#InsBtn'), navigationPromise])

    returnData.msg.success = true
  } catch (err) {
    returnData.err = true
  }
  return returnData
}
module.exports = {
  newCarSelect,
}
