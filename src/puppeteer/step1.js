const { retryForActions, waitForBlockUIVisible } = require('./api')

const TelcomChange = {
  SKT: '01',
  KT: '02',
  LGU: '03',
  arSKT: '04',
  arKT: '05',
  arLGU: '06',
}

// 1. 인증번호 요청
async function getSixNum(page, reqData) {
  const returnData = {
    err: false,
    msg: {},
  }
  try {
    await page.waitForTimeout(100)
    const { name, fsn, bsn, telcom, phone } = reqData
    const gender = parseInt(bsn.charAt(0)) % 2 === 0 ? 2 : 1 // 1: 남, 2: 여

    const setInput = async () => {
      // 인증 재요청시를 위해 입력칸 초기화
      await page.evaluate(() => {
        document.querySelector('#name').value = ''
      })
      await page.evaluate(() => {
        document.querySelector('#ssn1').value = ''
      })
      await page.evaluate(() => {
        document.querySelector('#ssn2').value = ''
      })
      await page.evaluate(() => {
        document.querySelector('#phoneNum').value = ''
      })

      // 고객정보 입력
      await page.type('#name', name)
      await page.type('#ssn1', fsn)
      await page.type('#ssn2', bsn)
      await page.type('#phoneNum', phone)
      await page.click(
        `#searchForm > ul > li:nth-child(3) > span.item > span > button:nth-child(${gender})`
      )
      await page.select('#divAgency', TelcomChange[telcom])
      await page.click(`#authNoReqBtn`)
    }
    if (await retryForActions(page, setInput)) {
      returnData.err = true
      return returnData
    }

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

    returnData.msg.success = true
  } catch (err) {
    returnData.err = true
  }

  return returnData
}

// 2. 인증번호 재요청
async function reGetSixNum(page, reqData) {
  const returnData = {
    err: false,
    msg: {},
  }
  try {
    await page.waitForTimeout(100)
    await page.click(`#authNo > span > span > span:nth-child(2) > button`)
    returnData.msg.success = true
  } catch (err) {
    returnData.err = true
  }

  return returnData
}

// 3. 인증확인
async function authSixNum(page, reqData) {
  const returnData = {
    err: false,
    msg: {},
  }
  try {
    await page.waitForTimeout(100)
    const { authNum } = reqData
    await page.evaluate(() => {
      document.querySelector('#authNumber').value = ''
    })
    await page.type('#authNumber', authNum)
    await page.click(`#authNext > button.theme_c.medium`)
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
    // 3년이내 체크로직 강화 필요 (우선 이전 코드 사용)
    await page
      .waitForSelector(
        '#tabs-1 > div.con_new > div.fbtn_area02.flex_area > button',
        { timeout: 10000 }
      )
      .catch(() => {
        // #contents_scroll > div.fbtn_area02.flex_area.fbtn_space > button (3년이내일시 나오는 버튼 추후 로직 강화시 적용 )
        returnData.msg = {
          success: false,
          data: '고객님은 현재 계약 해지시점과 신규 가입시접의 공백이 3년 이내의 계약자로서 해당서비스를 통한 보험료 계산이 불가합니다. 회사를 통해 문의하여 주시기 바랍니다.',
        }
        return returnData
      })
    returnData.msg.success = true
  } catch (err) {
    returnData.err = true
  }

  return returnData
}

module.exports = {
  getSixNum,
  reGetSixNum,
  authSixNum,
}
