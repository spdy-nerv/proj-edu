module.exports = {
    list: [
			{
				eventId: 1,
				name: '事件名称',
				address: '地址',
				year: 2017,
				month: 4,
				date: 3,
                day: 1,
				startTime: '15:00',  // 二十四小时进制
				hasFollow: true,     // 当前用户是否已经关注事件
				followInfo: {
					total: 188,    // 总关注人数
					avatars: [     // 关注用户头像列表，给出最新的6个即可
						'../../images/icon1.png',
						'../../images/icon1.png'
					]
				}
			}, {
				eventId: 2,
				name: '事件名称',
				address: '地址',
				year: 2017,
				month: 4,
				date: 3,
                day: 1,
				startTime: '16:00',  // 二十四小时进制
				hasFollow: true,     // 当前用户是否已经关注事件
				followInfo: {
					total: 188,    // 总关注人数
					avatars: [     // 关注用户头像列表，给出最新的6个即可
						'../../images/icon1.png',
						'../../images/icon1.png'
					]
				}
            }, {
                eventId: 3,
				name: '事件名称',
				address: '地址',
				year: 2017,
				month: 4,
				date: 20,
                day: 4,
				startTime: '09:00',  // 二十四小时进制
				hasFollow: true,     // 当前用户是否已经关注事件
				followInfo: {
					total: 188,    // 总关注人数
					avatars: [     // 关注用户头像列表，给出最新的6个即可
						'../../images/icon1.png',
						'../../images/icon1.png'
					]
				}
            }, {
                eventId: 4,
				name: '事件名称',
				address: '地址',
				year: 2017,
				month: 4,
				date: 24,
                day: 1,
				startTime: '09:00',  // 二十四小时进制
				hasFollow: true,     // 当前用户是否已经关注事件
				followInfo: {
					total: 188,    // 总关注人数
					avatars: [     // 关注用户头像列表，给出最新的6个即可
						'../../images/icon1.png',
						'../../images/icon1.png'
					]
				}
            }, {
                eventId: 5,
				name: '事件名称',
				address: '地址',
				year: 2017,
				month: 4,
				date: 24,
                day: 1,
				startTime: '16:00',  // 二十四小时进制
				hasFollow: true,     // 当前用户是否已经关注事件
				followInfo: {
					total: 188,    // 总关注人数
					avatars: [     // 关注用户头像列表，给出最新的6个即可
						'../../images/icon1.png',
						'../../images/icon1.png'
					]
				}
            }, {
                eventId: 6,
				name: '事件名称',
				address: '地址',
				year: 2017,
				month: 4,
				date: 24,
                day: 1,
				startTime: '20:00',  // 二十四小时进制
				hasFollow: true,     // 当前用户是否已经关注事件
				followInfo: {
					total: 188,    // 总关注人数
					avatars: [     // 关注用户头像列表，给出最新的6个即可
						'../../images/icon1.png',
						'../../images/icon1.png'
					]
				}
            },{
                eventId: 7,
				name: '事件名称',
				address: '地址',
				year: 2017,
				month: 4,
				date: 25,
                day: 2,
				startTime: '09:00',  // 二十四小时进制
				hasFollow: true,     // 当前用户是否已经关注事件
				followInfo: {
					total: 188,    // 总关注人数
					avatars: [     // 关注用户头像列表，给出最新的6个即可
						'../../images/icon1.png',
						'../../images/icon1.png'
					]
				}
            }, {
                eventId: 8,
				name: '事件名称',
				address: '地址',
				year: 2017,
				month: 4,
				date: 25,
                day: 2,
				startTime: '16:00',  // 二十四小时进制
				hasFollow: true,     // 当前用户是否已经关注事件
				followInfo: {
					total: 188,    // 总关注人数
					avatars: [     // 关注用户头像列表，给出最新的6个即可
						'../../images/icon1.png',
						'../../images/icon1.png'
					]
				}
            }, {
                eventId: 9,
				name: '事件名称',
				address: '地址',
				year: 2017,
				month: 4,
				date: 25,
                day: 2,
				startTime: '20:00',  // 二十四小时进制
				hasFollow: true,     // 当前用户是否已经关注事件
				followInfo: {
					total: 188,    // 总关注人数
					avatars: [     // 关注用户头像列表，给出最新的6个即可
						'../../images/icon1.png',
						'../../images/icon1.png'
					]
				}
            }
		],
		eventDays: [3, 20, 24, 25],      // 具有事件的当月日期列表 
		count: 6,     // 当月总事件数
		offset: 0,
		size: 20,
		hasMore: false   // 是否还有更多数据
};