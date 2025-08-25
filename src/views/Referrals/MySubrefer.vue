<template>
  <div class="my-subrefer-page">
    <!-- 桌面端表格 -->
    <div class="desktop-table" v-show="!isMobile">
      <div class="table-responsive">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>MemberID</th>
              <th>MemberName</th>
              <th>Rank</th>
              <th>SponsorID</th>
              <th>SponsorName</th>
              <th>PlacementID</th>
              <th>PlacementName</th>
              <th>L/R</th>
              <th>JoinWeek</th>
              <th>Createtime</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="member in currentPageData" :key="member.id">
              <td>{{ member.memberId }}</td>
              <td>{{ member.memberName }}</td>
              <td>{{ member.rank }}</td>
              <td>{{ member.sponsorId }}</td>
              <td>{{ member.sponsorName }}</td>
              <td>{{ member.placementId }}</td>
              <td>{{ member.placementName }}</td>
              <td>
                <span class="badge" :class="member.lr === 'Right' ? 'badge-primary' : 'badge-secondary'">
                  {{ member.lr }}
                </span>
              </td>
              <td>{{ member.joinWeek }}</td>
              <td>{{ member.createtime }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 移动端卡片列表 -->
    <div class="mobile-member-list" v-show="isMobile">
      <div 
        v-for="member in currentPageData" 
        :key="member.id" 
        class="member-card"
      >
        <div class="member-item">
          <span class="label">MemberID</span>
          <span class="value">{{ member.memberId }}</span>
        </div>
        <div class="member-item">
          <span class="label">MemberName</span>
          <span class="value">{{ member.memberName }}</span>
        </div>
        <div class="member-item">
          <span class="label">Rank</span>
          <span class="value">{{ member.rank }}</span>
        </div>
        <div class="member-item">
          <span class="label">SponsorID</span>
          <span class="value">{{ member.sponsorId }}</span>
        </div>
        <div class="member-item">
          <span class="label">SponsorName</span>
          <span class="value">{{ member.sponsorName }}</span>
        </div>
        <div class="member-item">
          <span class="label">PlacementID</span>
          <span class="value">{{ member.placementId }}</span>
        </div>
        <div class="member-item">
          <span class="label">PlacementName</span>
          <span class="value">{{ member.placementName }}</span>
        </div>
        <div class="member-item">
          <span class="label">L/R</span>
          <span class="badge" :class="member.lr === 'Right' ? 'badge-right' : 'badge-left'">
            {{ member.lr }}
          </span>
        </div>
        <div class="member-item">
          <span class="label">JoinWeek</span>
          <span class="value">{{ member.joinWeek }}</span>
        </div>
        <div class="member-item">
          <span class="label">Createtime</span>
          <span class="value">{{ member.createtime }}</span>
        </div>
      </div>
    </div>
    
    <!-- 分页 -->
    <Pagination 
      :current-page="currentPage"
      :total-pages="totalPages"
      :is-mobile="isMobile"
      @page-change="handlePageChange"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import Pagination from '@/components/Pagination.vue'

export default {
  name: 'MySubrefer',
  components: {
    Pagination
  },
  setup() {
    const currentPage = ref(1)
    const isMobile = ref(false)
    
    // 响应式检测移动设备
    const checkMobile = () => {
      isMobile.value = window.innerWidth <= 768
    }
    
    // 根据设备类型设置每页显示数量
    const pageSize = computed(() => {
      return isMobile.value ? 3 : 12
    })
    
    // 模拟数据
    const allMembers = ref([
      {
        id: 1,
        memberId: 'BCD4567890',
        memberName: 'Ahmed Farooqi',
        rank: 1,
        sponsorId: 'Placeholder',
        sponsorName: 'Placeholder',
        placementId: 'Placeholder',
        placementName: 'Placeholder',
        lr: 'Right',
        joinWeek: '2025-W02',
        createtime: 'Feb 05 2025 @4:37:pm'
      },
      {
        id: 2,
        memberId: 'BCD4567890',
        memberName: 'Sanaullah Khanum',
        rank: 2,
        sponsorId: 'Placeholder',
        sponsorName: 'Placeholder',
        placementId: 'Placeholder',
        placementName: 'Placeholder',
        lr: 'left',
        joinWeek: '2025-W02',
        createtime: 'Feb 05 2025 @4:37:pm'
      },
      {
        id: 3,
        memberId: 'BCD4567890',
        memberName: 'Ahmed Farooqi',
        rank: 3,
        sponsorId: 'Placeholder',
        sponsorName: 'Placeholder',
        placementId: 'Placeholder',
        placementName: 'Placeholder',
        lr: 'Right',
        joinWeek: '2025-W02',
        createtime: 'Feb 05 2025 @4:37:pm'
      },
      {
        id: 4,
        memberId: 'BCD4567891',
        memberName: 'John Smith',
        rank: 1,
        sponsorId: 'Placeholder',
        sponsorName: 'Placeholder',
        placementId: 'Placeholder',
        placementName: 'Placeholder',
        lr: 'Right',
        joinWeek: '2025-W01',
        createtime: 'Feb 01 2025 @2:15:pm'
      },
      {
        id: 5,
        memberId: 'BCD4567892',
        memberName: 'Sarah Johnson',
        rank: 2,
        sponsorId: 'Placeholder',
        sponsorName: 'Placeholder',
        placementId: 'Placeholder',
        placementName: 'Placeholder',
        lr: 'left',
        joinWeek: '2025-W01',
        createtime: 'Jan 30 2025 @10:30:am'
      },
      {
        id: 6,
        memberId: 'BCD4567893',
        memberName: 'Michael Brown',
        rank: 3,
        sponsorId: 'Placeholder',
        sponsorName: 'Placeholder',
        placementId: 'Placeholder',
        placementName: 'Placeholder',
        lr: 'Right',
        joinWeek: '2025-W01',
        createtime: 'Jan 28 2025 @3:45:pm'
      },
      {
        id: 7,
        memberId: 'BCD4567894',
        memberName: 'Emily Davis',
        rank: 4,
        sponsorId: 'Placeholder',
        sponsorName: 'Placeholder',
        placementId: 'Placeholder',
        placementName: 'Placeholder',
        lr: 'left',
        joinWeek: '2025-W01',
        createtime: 'Jan 25 2025 @11:20:am'
      },
      {
        id: 8,
        memberId: 'BCD4567895',
        memberName: 'David Wilson',
        rank: 1,
        sponsorId: 'Placeholder',
        sponsorName: 'Placeholder',
        placementId: 'Placeholder',
        placementName: 'Placeholder',
        lr: 'Right',
        joinWeek: '2024-W52',
        createtime: 'Dec 20 2024 @4:10:pm'
      },
      {
        id: 9,
        memberId: 'BCD4567896',
        memberName: 'Lisa Anderson',
        rank: 2,
        sponsorId: 'Placeholder',
        sponsorName: 'Placeholder',
        placementId: 'Placeholder',
        placementName: 'Placeholder',
        lr: 'left',
        joinWeek: '2024-W52',
        createtime: 'Dec 18 2024 @1:25:pm'
      },
      {
        id: 10,
        memberId: 'BCD4567897',
        memberName: 'Robert Taylor',
        rank: 3,
        sponsorId: 'Placeholder',
        sponsorName: 'Placeholder',
        placementId: 'Placeholder',
        placementName: 'Placeholder',
        lr: 'Right',
        joinWeek: '2024-W51',
        createtime: 'Dec 15 2024 @9:30:am'
      },
      {
        id: 11,
        memberId: 'BCD4567898',
        memberName: 'Jennifer Martinez',
        rank: 4,
        sponsorId: 'Placeholder',
        sponsorName: 'Placeholder',
        placementId: 'Placeholder',
        placementName: 'Placeholder',
        lr: 'left',
        joinWeek: '2024-W51',
        createtime: 'Dec 12 2024 @6:45:pm'
      },
      {
        id: 12,
        memberId: 'BCD4567899',
        memberName: 'Mark Thompson',
        rank: 5,
        sponsorId: 'Placeholder',
        sponsorName: 'Placeholder',
        placementId: 'Placeholder',
        placementName: 'Placeholder',
        lr: 'Right',
        joinWeek: '2024-W50',
        createtime: 'Dec 10 2024 @3:20:pm'
      },
      {
        id: 13,
        memberId: 'BCD4567900',
        memberName: 'Anna Johnson',
        rank: 1,
        sponsorId: 'Placeholder',
        sponsorName: 'Placeholder',
        placementId: 'Placeholder',
        placementName: 'Placeholder',
        lr: 'left',
        joinWeek: '2024-W49',
        createtime: 'Dec 05 2024 @11:45:am'
      }
    ])

    // 计算属性
    const totalPages = computed(() => {
      return Math.ceil(allMembers.value.length / pageSize.value)
    })

    const currentPageData = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value
      const end = start + pageSize.value
      return allMembers.value.slice(start, end)
    })

    // 方法
    const handlePageChange = (page) => {
      currentPage.value = page
    }

    // 生命周期
    onMounted(() => {
      checkMobile()
      window.addEventListener('resize', checkMobile)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', checkMobile)
    })

    return {
      currentPage,
      currentPageData,
      totalPages,
      isMobile,
      handlePageChange
    }
  }
}
</script>

<style scoped>
.my-subrefer-page {
  /* padding: 20px; */
}

/* 桌面端样式 */
.desktop-table {
  padding: 20px;
}

.table-responsive {
  margin-bottom: 20px;
}

.badge-primary {
  background-color: #007bff;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.badge-secondary {
  background-color: #6c757d;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

/* 移动端样式 */
.mobile-member-list {
  padding: 15px;
  background-color: #f5f5f5;
  margin-bottom: 20px;
}

.member-card {
  background: white;
  border-radius: 8px;
  margin-bottom: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.member-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.member-item:last-child {
  border-bottom: none;
}

.label {
  color: #666;
  font-size: 14px;
  font-weight: normal;
}

.value {
  color: #333;
  font-size: 14px;
  font-weight: 500;
}

.badge-right {
  background-color: #007bff;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.badge-left {
  background-color: #9c27b0;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}
</style>
