export interface Contract {
  id: string
  title: string
  name?: string
  client: string
  status: 'Draft' | 'Pending Review' | 'Active' | 'Completed' | 'Cancelled' | 'in_progress' | 'completed' | 'active'
  createdDate: string
  contractDate?: string
  value: string
  description?: string
  contractValue?: number
  endDate?: string
  startDate?: string
  clientId?: string
  assignedEmployeeId?: string
  pdfUrl?: string
  pdfContent?: string
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'admin' | 'employee' | 'client'
  employeeId?: string
  clientId?: string
  contactNumber?: string
  address?: string
  panNumber?: string
  aadhaarNumber?: string
  profileImageUrl?: string
  createdAt: string
}

export interface Comment {
  id: string
  contractId: string
  userId: string
  content: string
  lineNumber?: number
  createdAt: string
  resolved: boolean
}

export interface ContractStats {
  contractCount: number
  activeContracts: number
  completedContracts: number
  pendingContracts: number
} 