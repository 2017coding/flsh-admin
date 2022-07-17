import http from '@/utils/request'

export const getBannerList = (data) => {
  return http({
    url: '/manage/banner/selectBannerInfoPage',
    method: 'post',
    data: data
  })
}

export function addBanner(data) {
  return http({
    url: '/manage/banner/addBannerInfo',
    method: 'post',
    data: { ...data, operateType: 1 }
  })
}

export function updateBanner(data) {
  return http({
    url: '/manage/banner/updateBannerInfo',
    method: 'post',
    data: { ...data, operateType: 2 }
  })
}

export function delBanner(data) {
  return http({
    url: '/manage/banner/updateBannerInfo',
    method: 'post',
    data: { ...data, operateType: 3 }
  })
}
