const permissionsData = [
  // Admin
  { name: "create_role", group: "admin" },
  { name: "delete_role", group: "admin" },
  { name: "view_users", group: "admin" },
  { name: "delete_user", group: "admin" },
  { name: "assign_role", group: "admin" },
  { name: "create_admin", group: "admin" },
  { name: ("doctor", "admin"), group: "admin" },



  // Doctor
  { name: "create_appointment", group: "doctor" },
  { name: "view_appointment", group: "doctor" },
  { name: "update_appointment", group: "doctor" },
  { name: "view_patient_record", group: "doctor" },
  {name :"MANAGE_DOCTOR_PROFILE", group:"doctor"} ,

  // Patient
  { name: "view_own_appointment", group: "patient" },
  { name: "book_appointment", group: "patient" },
  { name: "cancel_appointment", group: "patient" },
  { name: "view_own_record", group: "patient" },
  {name:"MANAGE_PATIENT_PROFILE", group:"patient"}
];

module.exports = permissionsData;
