import request from '@/utils/request'

export function getCourseList() {
    return request({
        url: '/course/list',
        method: 'POST'
    })
}

export function getMyCourses() {
    return request({
        url: '/course/my',
        method: 'POST'
    })
}

export function selectCourse(courseId: number) {
    return request({
        url: '/course/select',
        method: 'POST',
        data: { courseId }
    })
}
