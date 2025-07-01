import { createContext, useContext, useState, useEffect } from 'react';
import { initialData, loadData, saveData } from '../utils/localStorage';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [patients, setPatients] = useState([]);
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    const savedPatients = loadData('patients') || initialData.patients;
    const savedIncidents = loadData('incidents') || initialData.incidents;
    setPatients(savedPatients);
    setIncidents(savedIncidents);
  }, []);

  useEffect(() => {
    saveData('patients', patients);
  }, [patients]);

  useEffect(() => {
    saveData('incidents', incidents);
  }, [incidents]);

  const addPatient = (patient) => {
    setPatients([...patients, { ...patient, id: `p${Date.now()}` }]);
  };

  const updatePatient = (id, updated) => {
    setPatients(patients.map(p => p.id === id ? { ...p, ...updated } : p));
  };

  const deletePatient = (id) => {
    setPatients(patients.filter(p => p.id !== id));
    // Also remove incidents for this patient
    setIncidents(incidents.filter(i => i.patientId !== id));
  };

  const addIncident = (incident) => {
    setIncidents([...incidents, { ...incident, id: `i${Date.now()}` }]);
  };

  const updateIncident = (id, updated) => {
    setIncidents(incidents.map(i => i.id === id ? { ...i, ...updated } : i));
  };

  const deleteIncident = (id) => {
    setIncidents(incidents.filter(i => i.id !== id));
  };

  const getPatientIncidents = (patientId) => {
    return incidents.filter(incident => incident.patientId === patientId);
  };

  const getUpcomingAppointments = (limit = 10) => {
    return incidents
      .filter(incident => new Date(incident.appointmentDate) > new Date())
      .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
      .slice(0, limit);
  };

  const getTotalRevenue = () => {
    return incidents
      .filter(incident => incident.status === 'Completed')
      .reduce((sum, incident) => sum + (incident.cost || 0), 0);
  };

  const getPatientStats = () => {
    const patientAppointments = {};
    incidents.forEach(incident => {
      if (patientAppointments[incident.patientId]) {
        patientAppointments[incident.patientId]++;
      } else {
        patientAppointments[incident.patientId] = 1;
      }
    });
    
    return Object.entries(patientAppointments)
      .map(([patientId, count]) => ({
        patient: patients.find(p => p.id === patientId),
        appointmentCount: count
      }))
      .sort((a, b) => b.appointmentCount - a.appointmentCount);
  };

  const getStatusCounts = () => {
    const statusCounts = { Pending: 0, Completed: 0, Cancelled: 0 };
    incidents.forEach(incident => {
      statusCounts[incident.status] = (statusCounts[incident.status] || 0) + 1;
    });
    return statusCounts;
  };

  return (
    <DataContext.Provider value={{
      patients,
      incidents,
      addPatient,
      updatePatient,
      deletePatient,
      addIncident,
      updateIncident,
      deleteIncident,
      getPatientIncidents,
      getUpcomingAppointments,
      getTotalRevenue,
      getPatientStats,
      getStatusCounts
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
