module.exports.cron = {
  firstJob: {
    schedule: '*/1 * * * *',
    onTick: async function () {
			const query = `
			SELECT TO_CHAR(to_timestamp(("createdAt" / 1000)),'YYYY-MM-DD') as date, id
			FROM "order"
			where TO_CHAR(CURRENT_DATE, 'YYYY-MM-DD') = TO_CHAR(to_timestamp(("createdAt" / 1000) + (2 * 24 * 60 * 60)),'YYYY-MM-DD')
			GROUP BY "date", "order"."id";
			`
			const dates = await sails.sendNativeQuery(query);
			if(dates.rows.length > 0) {
				for (let date of dates.rows) {
					await Order.updateOne({
						id: date.id
					}).set({ orderStatus: 'Delivered'})
				}
			}
    },
  },
};
