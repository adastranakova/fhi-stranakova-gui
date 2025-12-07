export interface User {
  name: string;
  email: string;
  memberId: string;
  balance: number;
  hasActiveRental?: boolean;
}
