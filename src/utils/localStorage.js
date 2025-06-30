export const loadData = (key) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  };
  
  export const saveData = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };
  
  export const initialData = {
    users: [
      { id: "1", role: "Admin", email: "admin@entnt.in", password: "admin123", name: "Dr. Sarah Johnson" },
      { id: "2", role: "Patient", email: "john@entnt.in", password: "patient123", patientId: "p1", name: "John Doe" },
      { id: "3", role: "Patient", email: "jane@entnt.in", password: "patient123", patientId: "p2", name: "Jane Smith" },
      { id: "4", role: "Patient", email: "mike@entnt.in", password: "patient123", patientId: "p3", name: "Mike Wilson" }
    ],
    patients: [
      {
        id: "p1",
        name: "John Doe",
        dob: "1990-05-10",
        contact: "1234567890",
        email: "john@entnt.in",
        address: "123 Main St, City, State 12345",
        emergencyContact: "Jane Doe - 0987654321",
        healthInfo: "No allergies, regular checkups needed",
        bloodType: "O+",
        insurance: "Delta Dental Plus"
      },
      {
        id: "p2",
        name: "Jane Smith",
        dob: "1985-08-15",
        contact: "2345678901",
        email: "jane@entnt.in",
        address: "456 Oak Ave, City, State 12345",
        emergencyContact: "Bob Smith - 1122334455",
        healthInfo: "Allergic to penicillin, sensitive to cold",
        bloodType: "A+",
        insurance: "MetLife Dental"
      },
      {
        id: "p3",
        name: "Mike Wilson",
        dob: "1992-12-03",
        contact: "3456789012",
        email: "mike@entnt.in",
        address: "789 Pine Rd, City, State 12345",
        emergencyContact: "Lisa Wilson - 2233445566",
        healthInfo: "Previous orthodontic treatment, no known allergies",
        bloodType: "B-",
        insurance: "Guardian Dental"
      }
    ],
    incidents: [
      {
        id: "i1",
        patientId: "p1",
        title: "Routine Cleaning",
        description: "Regular dental cleaning and checkup",
        comments: "Patient maintains good oral hygiene",
        appointmentDate: "2025-07-02T10:00:00",
        cost: 120,
        treatment: "Professional cleaning, fluoride treatment",
        status: "Completed",
        nextDate: "2026-01-02T10:00:00",
        files: [
          { 
            name: "cleaning_report.pdf", 
            type: "application/pdf",
            url: "data:application/pdf;base64,JVBERi0xLjQKJdPr6eEKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPD4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQovUmVzb3VyY2VzIDw8Ci9Gb250IDw8Ci9GMSAxMCAwIFIKPj4KPj4KL0NvbnRlbnRzIDQgMCBSCj4+CmVuZG9iago=",
            size: 1024
          }
        ]
      },
      {
        id: "i2",
        patientId: "p2",
        title: "Cavity Filling",
        description: "Small cavity in upper left molar",
        comments: "Patient experienced mild sensitivity",
        appointmentDate: "2025-07-03T14:30:00",
        cost: 185,
        treatment: "Composite filling",
        status: "Completed",
        nextDate: "2025-10-03T14:30:00",
        files: []
      },
      {
        id: "i3",
        patientId: "p1",
        title: "Crown Consultation",
        description: "Consultation for crown placement on damaged tooth",
        comments: "X-rays show good bone structure",
        appointmentDate: "2025-07-05T09:00:00",
        cost: 0,
        treatment: "Initial consultation and X-rays",
        status: "Pending",
        nextDate: "2025-07-12T09:00:00",
        files: []
      },
      {
        id: "i4",
        patientId: "p3",
        title: "Wisdom Tooth Extraction",
        description: "Impacted wisdom tooth removal",
        comments: "Pre-surgical evaluation completed",
        appointmentDate: "2025-07-08T11:00:00",
        cost: 350,
        treatment: "Surgical extraction",
        status: "Scheduled",
        nextDate: "2025-07-15T11:00:00",
        files: []
      },
      {
        id: "i5",
        patientId: "p2",
        title: "Orthodontic Consultation",
        description: "Initial consultation for braces",
        comments: "Moderate crowding, good candidate for treatment",
        appointmentDate: "2025-07-10T16:00:00",
        cost: 75,
        treatment: "Consultation and treatment planning",
        status: "Scheduled",
        nextDate: "2025-07-17T16:00:00",
        files: []
      }
    ]
  };
  