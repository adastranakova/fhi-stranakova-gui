export interface Station {
  name: string;
  address: string;
  numberOfSlots: number;
  availableBikes: number;
  slots: Slot[];
}

export interface Slot {
  slotNumber: number;
  bikeId: string | null;
  password: string | null;
  status: 'EMPTY' | 'OCCUPIED' | 'FAULTY'; // faulty nepouzivam
}
