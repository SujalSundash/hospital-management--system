const rolesData = [
  {
    name: "admin",
    permissions: ["create_role","delete_role","view_users","delete_user","assign_role"]
  },
  {
    name: "doctor",
    permissions: ["create_appointment","view_appointment","update_appointment","view_patient_record"]
  },
  {
    name: "patient",
    permissions: ["view_own_appointment","book_appointment","cancel_appointment","view_own_record"]
  }
];

module.exports = rolesData;