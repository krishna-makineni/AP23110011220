import { Notification } from "./notifications";

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    ID: "1",
    Type: "Placement",
    Message: "Google India is hiring! Apply before 15th May 2026. Package: ₹40 LPA. Interested candidates are required to submit their resume.",
    Timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    ID: "2",
    Type: "Placement",
    Message: "Microsoft hiring for Software Engineer role. CTC: ₹35 LPA. Interviews scheduled for May 20-22.",
    Timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    ID: "3",
    Type: "Result",
    Message: "Semester 5 Results are now available. Check your grades on the student portal.",
    Timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    ID: "4",
    Type: "Placement",
    Message: "Amazon Prime Video is recruiting interns for Summer 2026. Stipend: ₹50,000/month.",
    Timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    ID: "5",
    Type: "Event",
    Message: "Annual Tech Fest 2026 starting from May 25th. Register now at events.campus.edu",
    Timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    ID: "6",
    Type: "Result",
    Message: "Internship Results announced. Selected candidates, check your email for offer letter.",
    Timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    ID: "7",
    Type: "Event",
    Message: "Campus recruitment drive by Flipkart scheduled on June 1st 2026.",
    Timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    ID: "8",
    Type: "Placement",
    Message: "Meta is looking for Data Scientists. Salary: ₹50-70 LPA. Apply immediately.",
    Timestamp: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    ID: "9",
    Type: "Event",
    Message: "Coding competition finals on May 30th. Top 3 winners get internships.",
    Timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    ID: "10",
    Type: "Result",
    Message: "Course completion certificates available for download.",
    Timestamp: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
