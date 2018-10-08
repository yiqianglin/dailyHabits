
/* 根据筛选条件筛选出符合的医院（查医院） */
export const getHospitalSearchListByLocation = (state) => (filterParams) => {
  if (!filterParams.location) {
    return state.hospitalSearchList
  }
  return state.hospitalSearchList.filter((item, index) => {
    return item.city === filterParams.location
  })
}

/* 根据筛选条件筛选出符合的医生（查医生） */
export const getDoctorSearchListByFilter = (state) => (filterParams) => {
  return state.doctorSearchList.filter((item, index) => {
    if (filterParams.department !== '全部科室' && filterParams.doctitle === '全部医师') {
      // return item.main_depart === filterParams.department
      let otherDepartFlag = false
      if (item.depart && item.depart.length > 0) {
        item.depart.forEach((item) => {
          if (item.name === filterParams.department) {
            otherDepartFlag = true
          }
        })
      }
      return item.main_depart === filterParams.department || otherDepartFlag === true
    } else if (filterParams.department === '全部科室' && filterParams.doctitle !== '全部医师') {
      return item.doctitle === filterParams.doctitle
    } else if (filterParams.department !== '全部科室' && filterParams.doctitle !== '全部医师') {
      let otherDepartFlag = false
      if (item.depart && item.depart.length > 0) {
        item.depart.forEach((item) => {
          if (item.name === filterParams.department) {
            otherDepartFlag = true
          }
        })
      }
      return (item.main_depart === filterParams.department || otherDepartFlag === true) && item.doctitle === filterParams.doctitle
    } else {
      return true
    }
  })
}

export const getConsultantListByFilter = (state) => (filterParams) => {
  return state.consultantList.filter(({ editordiseases, city }) => {
    let ofDisease = (filterParams.disease && editordiseases.indexOf(filterParams.disease) !== -1) || !filterParams.disease
    let ofCity = (filterParams.city && filterParams.city === city.name) || !filterParams.city || filterParams.city === '全部城市'
    return ofDisease && ofCity
  })
}

export const consultantIds = (state) => state.consultantList.map(doctor => doctor.doctor_id)

/* 获取查医生选择的科室和职称 */
// export const getDoctorSearchFilterSelected = state => {
//   let temp = {
//     department: state.doctorSearchFilterData.departmentList[state.doctorSearchFilterData.departmentSelectedIndex],
//     doctitle: state.doctorSearchFilterData.doctitleList[state.doctorSearchFilterData.doctitleSelectedIndex]
//   }
//   return temp
// }
