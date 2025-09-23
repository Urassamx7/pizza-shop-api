import dayjs from 'dayjs'
import Elysia from 'elysia'
import { UnauthorizedError } from '../errors/unauthorized-error'
import { auth } from './auth'
import { db } from '../../db/connection'
import { orders } from '../../db/schema'
import { eq, and, gte, sum, sql } from 'drizzle-orm'

export const getMonthRevenue = new Elysia()
  .use(auth)
  .get('/metrics/month-revenue', async ({ getCurrentUser }) => {
    const { restaurantId } = await getCurrentUser()

    if (!restaurantId) {
      throw new UnauthorizedError()
    }

    const today = dayjs()
    const lastMonth = today.subtract(1, 'month')
    const startOfLastMonth = lastMonth.startOf('month')

    const monthRevenues = await db
      .select({
        monthWithYear:
          sql<string>`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`.mapWith(String),
        revenue: sum(orders.totalInCents).mapWith(Number),
      })
      .from(orders)
      .where(
        and(
          eq(orders.restaurantId, restaurantId),
          gte(orders.createdAt, startOfLastMonth.toDate()),
        ),
      )
      .groupBy(sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`)

    const currentMonthWithYear = today.format('YYYY-MM') // 2025-09
    const lastMonthWithYear = lastMonth.format('YYYY-MM') // 2025-08

    const currentMonthRevenue = monthRevenues.find((monthRevenue) => {
      return monthRevenue.monthWithYear === currentMonthWithYear
    })

    const lastMonthRevenue = monthRevenues.find((lastRevenue) => {
      return lastRevenue.monthWithYear === lastMonthWithYear
    })

    const diffFromLastMonth =
      currentMonthRevenue && lastMonthRevenue
        ? (currentMonthRevenue.revenue * 100) / lastMonthRevenue.revenue
        : null
    return {
      revenue: currentMonthRevenue?.revenue ?? 0,
      diffFromLastMonth: diffFromLastMonth
        ? Number((diffFromLastMonth - 100).toFixed(2))
        : 0,
    }
  })
