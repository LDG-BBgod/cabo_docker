const {
  retryForActions,
  waitForBlockUIVisible,
  clickAfterClickable,
  typeAfterVisible,
  selectAfterVisible,
} = require('./api')

///////////////////////
// 가입정보 옵션그룹 //
///////////////////////
const optionChange1 = {
  가입: 'modalchgPsn2Yn1',
  미가입: 'modalchgPsn2Yn0',
}
const optionChange2 = {
  '2천만원': 'modalchgTng1Amt02000',
  '3천만원': 'modalchgTng1Amt03000',
  '5천만원': 'modalchgTng1Amt05000',
  '7천만원': 'modalchgTng1Amt07000',
  '1억원': 'modalchgTng1Amt10000',
  '2억원': 'modalchgTng1Amt20000',
  '3억원': 'modalchgTng1Amt30000',
  '5억원': 'modalchgTng1Amt50000',
  '10억원': 'modalchgTng1Amt00010',
}
const optionChange3 = {
  자손1: 'modalchgDriverAmtCd00000015000000001500',
  자손2: 'modalchgDriverAmtCd00000030000000001500',
  자손3: 'modalchgDriverAmtCd00000050000000001500',
  자손4: 'modalchgDriverAmtCd00000100000000001500',
  자상1: 'modalchgDriverAmtCd00000100000000002000',
  자상2: 'modalchgDriverAmtCd00000100000000003000',
  자상3: 'modalchgDriverAmtCd00000200000000002000',
  자상4: 'modalchgDriverAmtCd00000200000000003000',
  자상5: 'modalchgDriverAmtCd00000200000000005000',
  자상6: 'modalchgDriverAmtCd00000300000000003000',
  자상7: 'modalchgDriverAmtCd00000300000000005000',
  미가입: 'modalchgDriverAmtCdZ',
}
const optionChange4 = {
  가입: 'modalchgNoInsYn1',
  미가입: 'modalchgNoInsYn0',
}
const optionChange5 = {
  가입: 'modalchgMycarYn1',
  미가입: 'modalchgMycarYn0',
}
const optionChange6 = {
  가입: 'modalchgEmgServiceYn1',
  미가입: 'modalchgEmgServiceYn0',
}
const optionChange7 = {
  '50만원': 'modalchgTngBaseAmt050',
  '100만원': 'modalchgTngBaseAmt100',
  '150만원': 'modalchgTngBaseAmt150',
  '200만원': 'modalchgTngBaseAmt200',
}
const optionChange8 = {
  피보험자1인: 'modalchgDriverScope3',
  피보험자1인지정1인: 'modalchgDriverScope7',
  누구나: 'modalchgDriverScope0',
  부부한정: 'modalchgDriverScope2',
  가족한정형제자매제외: 'modalchgDriverScope1',
  가족형제자매: 'modalchgDriverScope4',
}

///////////////////////
// 특별약관 옵션그룹 //
///////////////////////
const addOptionChange1 = {
  2000: '02000',
  3000: '03000',
  4000: '04000',
  5000: '05000',
  6000: '06000',
  7000: '07000',
  8000: '08000',
  9000: '09000',
  10000: '10000',
  11000: '11000',
  12000: '12000',
  13000: '13000',
  14000: '14000',
  15000: '15000',
  16000: '16000',
  17000: '17000',
  18000: '18000',
  19000: '19000',
  19000: '19000',
}
const addOptionChange2 = {
  no: 'special2_N',
  yes: 'special2_Y',
  커넥티드: 'special2_A',
}
const addOptionChange3 = {
  no: 'special3_N',
  yes: 'special3_Y',
}
const addOptionChange4 = {
  no: 'special4_N',
  yes: 'special4_Y',
}
const addOptionChange5 = {
  no: 'special5_N',
  yes: 'special5_Y',
}
const addOptionChange5_1 = {
  1: 'special5Opt2',
  2: 'special5Opt3',
}
const addOptionChange6 = {
  미가입: 'N',
  티맵: 'A',
  커넥티드카: 'B',
  아이나비: 'C',
}
const addOptionChange7 = {
  no: 'special7_N',
  yes: 'special7_Y',
}
const addOptionChange8 = {
  no: 'special8_N',
  yes: 'special8_Y',
}
const addOptionChange9 = {
  no: 'special9_N',
  yes: 'special9_Y',
}
const addOptionChange10 = {
  no: 'special10_N',
  yes: 'special10_Y',
}
const addOptionChange11 = {
  no: 'special11_N',
  yes: 'special11_Y',
}
const addOptionChange13 = {
  no: 'special13_N',
  yes: 'special13_Y',
}
const addOptionChange14 = {
  no: 'special14_N',
  yes: 'special14_Y',
}

///////////////////////
//  크롤링 함수그룹  //
///////////////////////
// 1. 갱신차량 기존가입정보 스크래핑
async function getExistCarInfo(page, reqData) {
  const returnData = {
    err: false,
    msg: {},
  }
  try {
    await page.waitForTimeout(100)
    await page.waitForSelector('#New_chgPsn1Yn', {
      visible: true,
      timeout: 3000,
    })
    const dataArr = await page.evaluate(() => {
      const count = document.querySelector(
        '#contents_scroll > div.product_search > div.join_info > div.accordion_list4.renew.smk_accordion.acc_with_icon'
      ).children.length
      const tempArr = []
      for (let i = 1; i <= count; i++) {
        const text = document.querySelector(
          `#contents_scroll > div.product_search > div.join_info > div.accordion_list4.renew.smk_accordion.acc_with_icon > div.accordion_in:nth-child(${i}) > div.acc_head > span:nth-child(3)`
        ).textContent
        tempArr.push(text)
      }
      return tempArr
    })

    returnData.msg = {
      success: true,
      data: dataArr,
    }
  } catch {
    returnData.err = true
  }
  return returnData
}

// 2. 갱신차량 가입정보 선택
async function selectExistContractInfo(page, reqData) {
  const returnData = {
    err: false,
    msg: {},
  }
  try {
    await page.waitForTimeout(100)
    const {
      contractOption1,
      contractOption2,
      contractOption3,
      contractOption4,
      contractOption5,
      contractOption6,
      contractOption7,
      contractOption8,
      contractOption9,
      contractOption10,
    } = reqData

    // 대인2
    const selectOption1 = async () => {
      await clickAfterClickable(
        page,
        `#contents_scroll > div.product_search > div.join_info > div.accordion_list4.renew.smk_accordion.acc_with_icon > div:nth-child(2)`
      )
      await clickAfterClickable(page, `#${optionChange1[contractOption1]}`)
    }
    if (await retryForActions(page, selectOption1)) {
      returnData.err = true
      return returnData
    }

    // 대물
    const selectOption2 = async () => {
      await clickAfterClickable(
        page,
        `#contents_scroll > div.product_search > div.join_info > div.accordion_list4.renew.smk_accordion.acc_with_icon > div:nth-child(3)`
      )
      await clickAfterClickable(page, `#${optionChange2[contractOption2]}`)
    }
    if (await retryForActions(page, selectOption2)) {
      returnData.err = true
      return returnData
    }

    // 자손자상
    const selectOption3 = async () => {
      await clickAfterClickable(
        page,
        `#contents_scroll > div.product_search > div.join_info > div.accordion_list4.renew.smk_accordion.acc_with_icon > div:nth-child(4)`
      )
      switch (contractOption3.substring(0, 2)) {
        case '자손':
          await clickAfterClickable(
            page,
            `#contents_scroll > div.product_search > div.join_info > div.accordion_list4.smk_accordion.acc_with_icon > div:nth-child(4) > div.acc_content.tab_wrap > div.tab_menu.ui-tabs.ui-widget.ui-widget-content.ui-corner-all > ul > li:nth-child(1)`
          )
          break
        case '자상':
          await clickAfterClickable(
            page,
            `#contents_scroll > div.product_search > div.join_info > div.accordion_list4.smk_accordion.acc_with_icon > div:nth-child(4) > div.acc_content.tab_wrap > div.tab_menu.ui-tabs.ui-widget.ui-widget-content.ui-corner-all > ul > li:nth-child(2)`
          )
          break
        case '미가':
          await clickAfterClickable(
            page,
            `#contents_scroll > div.product_search > div.join_info > div.accordion_list4.smk_accordion.acc_with_icon > div:nth-child(4) > div.acc_content.tab_wrap > div.tab_menu.ui-tabs.ui-widget.ui-widget-content.ui-corner-all > ul > li:nth-child(3)`
          )
          break
        default:
          break
      }
      await clickAfterClickable(page, `#${optionChange3[contractOption3]}`)
    }
    if (await retryForActions(page, selectOption3)) {
      returnData.err = true
      return returnData
    }

    // 무보
    const selectOption4 = async () => {
      await clickAfterClickable(
        page,
        `#contents_scroll > div.product_search > div.join_info > div.accordion_list4.renew.smk_accordion.acc_with_icon > div:nth-child(5)`
      )
      await clickAfterClickable(page, `#${optionChange4[contractOption4]}`)
    }
    if (await retryForActions(page, selectOption4)) {
      returnData.err = true
      return returnData
    }

    // 자차
    const selectOption5 = async () => {
      await clickAfterClickable(
        page,
        `#contents_scroll > div.product_search > div.join_info > div.accordion_list4.renew.smk_accordion.acc_with_icon > div:nth-child(6)`
      )
      await clickAfterClickable(page, `#${optionChange5[contractOption5]}`)
    }
    if (await retryForActions(page, selectOption5)) {
      returnData.err = true
      return returnData
    }

    // 긴급출동
    const selectOption6 = async () => {
      await clickAfterClickable(
        page,
        `#contents_scroll > div.product_search > div.join_info > div.accordion_list4.renew.smk_accordion.acc_with_icon > div:nth-child(7)`
      )
      await clickAfterClickable(page, `#${optionChange6[contractOption6]}`)
    }
    if (await retryForActions(page, selectOption6)) {
      returnData.err = true
      return returnData
    }

    // 사고할증
    const selectOption7 = async () => {
      await clickAfterClickable(
        page,
        `#contents_scroll > div.product_search > div.join_info > div.accordion_list4.renew.smk_accordion.acc_with_icon > div:nth-child(8)`
      )
      await clickAfterClickable(page, `#${optionChange7[contractOption7]}`)
    }
    if (await retryForActions(page, selectOption7)) {
      returnData.err = true
      return returnData
    }

    // 운전범위
    const selectOption8 = async () => {
      await clickAfterClickable(
        page,
        `#contents_scroll > div.product_search > div.join_info > div.accordion_list4.renew.smk_accordion.acc_with_icon > div:nth-child(9)`
      )
      await clickAfterClickable(page, `#${optionChange8[contractOption8]}`)
    }
    if (await retryForActions(page, selectOption8)) {
      returnData.err = true
      return returnData
    }

    // 최소운전자 생년월일
    const selectOption9 = async () => {
      await clickAfterClickable(
        page,
        `#contents_scroll > div.product_search > div.join_info > div.accordion_list4.renew.smk_accordion.acc_with_icon > div:nth-child(10)`
      )
      await page.evaluate((birthString) => {
        document.querySelector('#searchBirthdayYesr').value =
          birthString.substring(0, 4)
        document.querySelector('#searchBirthdayMM').value =
          birthString.substring(4, 6)
        document.querySelector('#searchBirthdayDD').value =
          birthString.substring(6, 8)
      }, contractOption9)
      await clickAfterClickable(
        page,
        `body > div.remodal-wrapper.remodal-is-opened > div > div.pop_btnArea.flex_area.pop_btn01 > button:nth-child(2)`
      )
    }
    if (await retryForActions(page, selectOption9)) {
      returnData.err = true
      return returnData
    }

    // 지정1인 or 배우자 생년월일
    const selectOption10 = async () => {
      if (
        contractOption8 === '피보험자1인지정1인' ||
        contractOption8 === '부부한정'
          ? true
          : false
      ) {
        await clickAfterClickable(
          page,
          `#contents_scroll > div.product_search > div.join_info > div.accordion_list4.renew.smk_accordion.acc_with_icon > div:nth-child(11)`
        )
        await page.evaluate((birthString) => {
          document.querySelector('#searchBirthdayYesr').value =
            birthString.substring(0, 4)
          document.querySelector('#searchBirthdayMM').value =
            birthString.substring(4, 6)
          document.querySelector('#searchBirthdayDD').value =
            birthString.substring(6, 8)
        }, contractOption10)
        await clickAfterClickable(
          page,
          `body > div.remodal-wrapper.remodal-is-opened > div > div.pop_btnArea.flex_area.pop_btn01 > button:nth-child(2)`
        )
      }
    }
    if (await retryForActions(page, selectOption10)) {
      returnData.err = true
      return returnData
    }

    // submit
    await clickAfterClickable(
      page,
      `#contents_scroll > div.product_search > div.join_info > div.fbtn_area.flex_area > button`
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

    returnData.msg.success = true
  } catch (err) {
    console.error(err)
    returnData.err = true
  }
  return returnData
}

// 3. 신규차량 가입정보 선택
async function selectNewContractInfo(page, reqData) {
  const returnData = {
    err: false,
    msg: {},
  }
  try {
    await page.waitForTimeout(100)
    const {
      contractOption1,
      contractOption2,
      contractOption3,
      contractOption4,
      contractOption5,
      contractOption6,
      contractOption7,
      contractOption8,
      contractOption9,
      contractOption10,
    } = reqData

    // 대인2
    const selectOption1 = async () => {
      await clickAfterClickable(
        page,
        `#contents_scroll > div.product_search > div.join_info > div.accordion_list4.smk_accordion.acc_with_icon > div:nth-child(2)`
      )
      await clickAfterClickable(page, `#${optionChange1[contractOption1]}`)
    }
    if (await retryForActions(page, selectOption1)) {
      returnData.err = true
      return returnData
    }

    // 대물
    const selectOption2 = async () => {
      await clickAfterClickable(
        page,
        `#contents_scroll > div.product_search > div.join_info > div.accordion_list4.smk_accordion.acc_with_icon > div:nth-child(3)`
      )
      await clickAfterClickable(page, `#${optionChange2[contractOption2]}`)
    }
    if (await retryForActions(page, selectOption2)) {
      returnData.err = true
      return returnData
    }

    // 자손자상
    const selectOption3 = async () => {
      await clickAfterClickable(
        page,
        `#contents_scroll > div.product_search > div.join_info > div.accordion_list4.smk_accordion.acc_with_icon > div:nth-child(4)`
      )
      switch (contractOption3.substring(0, 2)) {
        case '자손':
          await clickAfterClickable(
            page,
            `#contents_scroll > div.product_search > div.join_info > div.accordion_list4.smk_accordion.acc_with_icon > div:nth-child(4) > div.acc_content.tab_wrap > div.tab_menu.ui-tabs.ui-widget.ui-widget-content.ui-corner-all > ul > li:nth-child(1)`
          )
          break
        case '자상':
          await clickAfterClickable(
            page,
            `#contents_scroll > div.product_search > div.join_info > div.accordion_list4.smk_accordion.acc_with_icon > div:nth-child(4) > div.acc_content.tab_wrap > div.tab_menu.ui-tabs.ui-widget.ui-widget-content.ui-corner-all > ul > li:nth-child(2)`
          )
          break
        case '미가':
          await clickAfterClickable(
            page,
            `#contents_scroll > div.product_search > div.join_info > div.accordion_list4.smk_accordion.acc_with_icon > div:nth-child(4) > div.acc_content.tab_wrap > div.tab_menu.ui-tabs.ui-widget.ui-widget-content.ui-corner-all > ul > li:nth-child(3)`
          )
          break
        default:
          break
      }
      await clickAfterClickable(page, `#${optionChange3[contractOption3]}`)
    }
    if (await retryForActions(page, selectOption3)) {
      returnData.err = true
      return returnData
    }

    // 무보
    const selectOption4 = async () => {
      await clickAfterClickable(
        page,
        `#contents_scroll > div.product_search > div.join_info > div.accordion_list4.smk_accordion.acc_with_icon > div:nth-child(5)`
      )
      await clickAfterClickable(page, `#${optionChange4[contractOption4]}`)
    }
    if (await retryForActions(page, selectOption4)) {
      returnData.err = true
      return returnData
    }

    // 자차
    const selectOption5 = async () => {
      await clickAfterClickable(
        page,
        `#contents_scroll > div.product_search > div.join_info > div.accordion_list4.smk_accordion.acc_with_icon > div:nth-child(6)`
      )
      await clickAfterClickable(page, `#${optionChange5[contractOption5]}`)
    }
    if (await retryForActions(page, selectOption5)) {
      returnData.err = true
      return returnData
    }

    // 긴급출동
    const selectOption6 = async () => {
      await clickAfterClickable(
        page,
        `#contents_scroll > div.product_search > div.join_info > div.accordion_list4.smk_accordion.acc_with_icon > div:nth-child(7)`
      )
      await clickAfterClickable(page, `#${optionChange6[contractOption6]}`)
    }
    if (await retryForActions(page, selectOption6)) {
      returnData.err = true
      return returnData
    }

    // 사고할증
    const selectOption7 = async () => {
      await clickAfterClickable(
        page,
        `#contents_scroll > div.product_search > div.join_info > div.accordion_list4.smk_accordion.acc_with_icon > div:nth-child(8)`
      )
      await clickAfterClickable(page, `#${optionChange7[contractOption7]}`)
    }
    if (await retryForActions(page, selectOption7)) {
      returnData.err = true
      return returnData
    }

    // 운전범위
    const selectOption8 = async () => {
      await clickAfterClickable(
        page,
        `#contents_scroll > div.product_search > div.join_info > div.accordion_list4.smk_accordion.acc_with_icon > div:nth-child(9)`
      )
      await clickAfterClickable(page, `#${optionChange8[contractOption8]}`)
    }
    if (await retryForActions(page, selectOption8)) {
      returnData.err = true
      return returnData
    }

    // 최소운전자 생년월일
    const selectOption9 = async () => {
      await clickAfterClickable(
        page,
        `#contents_scroll > div.product_search > div.join_info > div.accordion_list4.smk_accordion.acc_with_icon > div:nth-child(10)`
      )
      await page.evaluate((birthString) => {
        document.querySelector('#searchBirthdayYesr').value =
          birthString.substring(0, 4)
        document.querySelector('#searchBirthdayMM').value =
          birthString.substring(4, 6)
        document.querySelector('#searchBirthdayDD').value =
          birthString.substring(6, 8)
      }, contractOption9)
      await clickAfterClickable(
        page,
        `body > div.remodal-wrapper.remodal-is-opened > div > div.pop_btnArea.flex_area.pop_btn01 > button:nth-child(2)`
      )
    }
    if (await retryForActions(page, selectOption9)) {
      returnData.err = true
      return returnData
    }

    // 지정1인 or 배우자 생년월일
    const selectOption10 = async () => {
      if (
        contractOption8 === '피보험자1인지정1인' ||
        contractOption8 === '부부한정'
          ? true
          : false
      ) {
        await clickAfterClickable(
          page,
          `#contents_scroll > div.product_search > div.join_info > div.accordion_list4.smk_accordion.acc_with_icon > div:nth-child(11)`
        )
        await page.evaluate((birthString) => {
          document.querySelector('#searchBirthdayYesr').value =
            birthString.substring(0, 4)
          document.querySelector('#searchBirthdayMM').value =
            birthString.substring(4, 6)
          document.querySelector('#searchBirthdayDD').value =
            birthString.substring(6, 8)
        }, contractOption10)
        await clickAfterClickable(
          page,
          `body > div.remodal-wrapper.remodal-is-opened > div > div.pop_btnArea.flex_area.pop_btn01 > button:nth-child(2)`
        )
      }
    }
    if (await retryForActions(page, selectOption10)) {
      returnData.err = true
      return returnData
    }

    // submit
    await clickAfterClickable(
      page,
      `#contents_scroll > div.product_search > div.join_info > div.fbtn_area.flex_area > button`
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

    returnData.msg.success = true
  } catch (err) {
    console.error(err)
    returnData.err = true
  }
  return returnData
}

// 4. 추가특약 선택
async function selectAddCarInfo(page, reqData) {
  const returnData = {
    err: false,
    msg: {},
  }
  try {
    await page.waitForTimeout(100)
    const {
      addOption1,
      addOption2,
      addOption2_1,
      addOption2_2,
      addOption2_3,
      addOption3,
      addOption3_1,
      addOption3_2,
      addOption4,
      addOption5,
      addOption5_1,
      addOption6,
      addOption6_1,
      addOption7,
      addOption7_1,
      addOption7_2,
      addOption8,
      addOption9,
      addOption10,
      addOption11,
      addOption13,
      addOption14,
    } = reqData

    // 마일리지 할인 (다음버튼 및 마일리지 탭 클릭시 정상작동을 안하여 반복시도 불가능)
    await clickAfterClickable(page, '#special1_Y')
    await page.evaluate(() => {
      document.getElementById('special1_msg').style.display = 'block'
    })
    await page.select('#special1Opt', addOptionChange1[addOption1])

    // 블랙박스 할인
    const selectAddOption2 = async () => {
      await clickAfterClickable(
        page,
        `#contents_scroll > div.product_search > div.join_info2 > div.accordion_list4.smk_accordion.acc_with_icon > div:nth-child(2)`
      )
      await clickAfterClickable(page, `#${addOptionChange2[addOption2]}`)
      if (addOption2 === 'yes' || addOption2 === '커넥티드') {
        await typeAfterVisible(page, `#special2Opt1Y`, addOption2_1)
        await typeAfterVisible(page, `#special2Opt1M`, addOption2_2)
        await typeAfterVisible(page, `#special2Opt2`, addOption2_3)
      }
    }
    if (await retryForActions(page, selectAddOption2)) {
      returnData.err = true
      return returnData
    }

    // 자녀 할인
    const selectAddOption3 = async () => {
      await clickAfterClickable(
        page,
        `#contents_scroll > div.product_search > div.join_info2 > div.accordion_list4.smk_accordion.acc_with_icon > div:nth-child(3)`
      )
      await clickAfterClickable(page, `#${addOptionChange3[addOption3]}`)
      if (addOption3 === 'yes') {
        if (addOption3_1 === '자녀') {
          await clickAfterClickable(page, `#childSlt1`)
          await clickAfterClickable(page, `#special3Opt`)
          await page.evaluate((birthString) => {
            document.querySelector('#special3OptY').value =
              birthString.substring(0, 4)
            document.querySelector('#special3OptM').value =
              birthString.substring(4, 6)
            document.querySelector('#special3OptD').value =
              birthString.substring(6, 8)
          }, addOption3_2)
          await clickAfterClickable(
            page,
            `body > div.remodal-wrapper.remodal-is-opened > div > div.pop_btnArea.flex_area.pop_btn01 > button:nth-child(2)`
          )
        } else {
          await clickAfterClickable(page, `#childSlt2`)
        }
      }
    }
    if (await retryForActions(page, selectAddOption3)) {
      returnData.err = true
      return returnData
    }

    // 커넥티드카 할인
    const selectAddOption4 = async () => {
      await clickAfterClickable(
        page,
        `#contents_scroll > div.product_search > div.join_info2 > div.accordion_list4.smk_accordion.acc_with_icon > div:nth-child(4)`
      )
      await clickAfterClickable(page, `#${addOptionChange4[addOption4]}`)
    }
    if (await retryForActions(page, selectAddOption4)) {
      returnData.err = true
      return returnData
    }

    // 대중교통 할인
    const selectAddOption5 = async () => {
      await clickAfterClickable(
        page,
        `#contents_scroll > div.product_search > div.join_info2 > div.accordion_list4.smk_accordion.acc_with_icon > div:nth-child(5)`
      )
      await clickAfterClickable(page, `#${addOptionChange5[addOption5]}`)
      if (addOption5 === 'yes') {
        await clickAfterClickable(page, `#${addOptionChange5_1[addOption5_1]}`)
      }
    }
    if (await retryForActions(page, selectAddOption5)) {
      returnData.err = true
      return returnData
    }

    // 안전운전습관 할인
    const selectAddOption6 = async () => {
      await clickAfterClickable(
        page,
        `#contents_scroll > div.product_search > div.join_info2 > div.accordion_list4.smk_accordion.acc_with_icon > div:nth-child(6)`
      )
      await clickAfterClickable(page, `#${addOptionChange5[addOption5]}`)
      await selectAfterVisible(
        page,
        '#chgSpecial6Yn',
        addOptionChange6[addOption6]
      )
      if (
        addOption6 === '티맵' ||
        addOption6 === '커넥티드카' ||
        addOption6 === '아이나비'
      ) {
        await typeAfterVisible(page, `#special6Opt`, addOption6_1)
      }
    }
    if (await retryForActions(page, selectAddOption6)) {
      returnData.err = true
      return returnData
    }

    // 과거 주행거리 할인
    const selectAddOption7 = async () => {
      await clickAfterClickable(
        page,
        `#contents_scroll > div.product_search > div.join_info2 > div.accordion_list4.smk_accordion.acc_with_icon > div:nth-child(7)`
      )
      await clickAfterClickable(page, `#${addOptionChange7[addOption7]}`)
      if (addOption7 === 'yes') {
        await typeAfterVisible(page, `#special7Opt1`, addOption7_1)
        await typeAfterVisible(page, `#special7Opt2`, addOption7_2)
      }
    }
    if (await retryForActions(page, selectAddOption7)) {
      returnData.err = true
      return returnData
    }

    // 이메일 할인
    const selectAddOption8 = async () => {
      await clickAfterClickable(
        page,
        `#contents_scroll > div.product_search > div.join_info2 > div.accordion_list4.smk_accordion.acc_with_icon > div:nth-child(8)`
      )
      await clickAfterClickable(page, `#${addOptionChange8[addOption8]}`)
    }
    if (await retryForActions(page, selectAddOption8)) {
      returnData.err = true
      return returnData
    }

    // 서민우대 할인
    const selectAddOption9 = async () => {
      await clickAfterClickable(
        page,
        `#contents_scroll > div.product_search > div.join_info2 > div.accordion_list4.smk_accordion.acc_with_icon > div:nth-child(9)`
      )
      await clickAfterClickable(page, `#${addOptionChange9[addOption9]}`)
      if (addOption9 === 'yes') {
        await clickAfterClickable(page, '#special9_msg > div > div > button')
        await clickAfterClickable(page, '#pop_alert_btn > button')
      }
    }
    if (await retryForActions(page, selectAddOption9)) {
      returnData.err = true
      return returnData
    }

    // 차선이탈 경고장치 할인
    const selectAddOption10 = async () => {
      await clickAfterClickable(
        page,
        `#contents_scroll > div.product_search > div.join_info2 > div.accordion_list4.smk_accordion.acc_with_icon > div:nth-child(10)`
      )
      await clickAfterClickable(page, `#${addOptionChange10[addOption10]}`)
    }
    if (await retryForActions(page, selectAddOption10)) {
      returnData.err = true
      return returnData
    }

    // 전방충돌 방지장치 할인
    const selectAddOption11 = async () => {
      await clickAfterClickable(
        page,
        `#contents_scroll > div.product_search > div.join_info2 > div.accordion_list4.smk_accordion.acc_with_icon > div:nth-child(11)`
      )
      await clickAfterClickable(page, `#${addOptionChange11[addOption11]}`)
    }
    if (await retryForActions(page, selectAddOption11)) {
      returnData.err = true
      return returnData
    }

    // 걸음수 할인
    const selectAddOption13 = async () => {
      await clickAfterClickable(
        page,
        `#contents_scroll > div.product_search > div.join_info2 > div.accordion_list4.smk_accordion.acc_with_icon > div:nth-child(12)`
      )
      if (addOption13 === 'yes') {
        await clickAfterClickable(
          page,
          `#contents_scroll > div.product_search > div.join_info2 > div.accordion_list4.smk_accordion.acc_with_icon > div:nth-child(12) > div.acc_content > ul > li:nth-child(1) > input`
        )
      } else {
        await clickAfterClickable(
          page,
          `#contents_scroll > div.product_search > div.join_info2 > div.accordion_list4.smk_accordion.acc_with_icon > div:nth-child(12) > div.acc_content > ul > li:nth-child(2) > input`
        )
      }
    }
    if (await retryForActions(page, selectAddOption13)) {
      returnData.err = true
      return returnData
    }

    // 세컨카 할인
    const selectAddOption14 = async () => {
      await clickAfterClickable(
        page,
        `#contents_scroll > div.product_search > div.join_info2 > div.accordion_list4.smk_accordion.acc_with_icon > div:nth-child(13)`
      )
      if (addOption14 === 'yes') {
        await clickAfterClickable(
          page,
          `#contents_scroll > div.product_search > div.join_info2 > div.accordion_list4.smk_accordion.acc_with_icon > div:nth-child(13) > div.acc_content > ul > li:nth-child(1) > input`
        )
      } else {
        await clickAfterClickable(
          page,
          `#contents_scroll > div.product_search > div.join_info2 > div.accordion_list4.smk_accordion.acc_with_icon > div:nth-child(13) > div.acc_content > ul > li:nth-child(2) > input`
        )
      }
    }
    if (await retryForActions(page, selectAddOption14)) {
      returnData.err = true
      return returnData
    }

    returnData.msg.success = true
  } catch {
    returnData.err = true
  }
  return returnData
}

module.exports = {
  getExistCarInfo,
  selectExistContractInfo,
  selectNewContractInfo,
  selectAddCarInfo,
}
