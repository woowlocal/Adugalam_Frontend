import { create } from "zustand";

const dummyBookings = [
  { id: 1, name: "GreenField Turf", status: "upcoming", date: "Dec 10, 2025", location: "Fairfield Arena" ,image:"/gr (1).png" },
  { id: 2, name: "SkyLine Turf", status: "upcoming", date: "Dec 20, 2025", location: "Bangalore Complex" ,image:"/gr (2).png"},
  { id: 3, name: "Elite Turf", status: "completed", date: "Nov 15, 2025", location: "Chennai" ,image:"/gr (3).png"},
  { id: 4, name: "Stadium 5v5", status: "completed", date: "Nov 1, 2025", location: "Coimbatore" ,image:"/gr (4).png"}
];

export const useBookingStore = create((set) => ({
  bookings: dummyBookings,
  activeTab: "upcoming",
  selectedBooking: null,

  setActiveTab: (tab) => set({ activeTab: tab }),
  selectBooking: (booking) => set({ selectedBooking: booking }),
  clearSelectedBooking: () => set({ selectedBooking: null }),
}));
