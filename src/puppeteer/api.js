// 재시도
const RETRY_COUNT = 7
async function retryForActions(page, Func) {
  for (let retry = 1; retry <= RETRY_COUNT; retry++) {
    try {
      await Func()
      return false
    } catch (err) {
      console.log('실행실패', retry, ' : ', Func)
      if (retry === RETRY_COUNT) {
        console.log(err)
      }
      await page.waitForTimeout(200)
    }
  }
  return true
}

// 로딩 기다림
async function waitForBlockUIVisible(page) {
  try {
    await page.waitForFunction(
      () => {
        const blockUIElement = document.querySelector('.blockUI')
        return blockUIElement !== null
      },
      { timeout: 10000 }
    )

    try {
      await page.waitForFunction(() => {
        const blockUIElement = document.querySelector('.blockUI')
        return blockUIElement === null
      })

      return true
    } catch (err) {
      ;('보이기 기다리다 에러남')
      return false
    }
  } catch (err) {
    ;('보이기 기다리다 에러남')
    return false
  }
}

// 요소 보여지는거 기다리고 난후 클릭
async function clickAfterClickable(page, selecter, timeout = 1000) {
  await page.waitForSelector(selecter, {
    visible: true,
    timeout: timeout,
  })
  await page.waitForTimeout(30)
  await page.click(selecter)
}
// 요소 보여지는거 기다리고 난후 입력
async function typeAfterVisible(page, selecter, value, timeout = 1000) {
  await page.waitForSelector(selecter, {
    visible: true,
    timeout: timeout,
  })
  await page.waitForTimeout(30)
  await page.evaluate((CSSselecter) => {
    document.querySelector(CSSselecter).value = ''
  }, selecter)
  await page.type(selecter, value)
}
// 요소 보여지는거 기다리고 난후 선택
async function selectAfterVisible(page, selecter, value, timeout = 1000) {
  await page.waitForSelector(selecter, {
    visible: true,
    timeout: timeout,
  })
  await page.waitForTimeout(30)
  await page.select(selecter, value)
}

// 요소에서 텍스트 가져오기
async function getText(page, selecter) {
  const text = await page.evaluate((element) => {
    return element.textContent
  }, selecter)
  return text
}
module.exports = {
  waitForBlockUIVisible,
  retryForActions,
  clickAfterClickable,
  typeAfterVisible,
  selectAfterVisible,
  getText,
}
