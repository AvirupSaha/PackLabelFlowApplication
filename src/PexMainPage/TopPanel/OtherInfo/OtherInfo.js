import React, { useEffect, useState } from 'react';
import './OtherInfo.css';
import { useRoom } from '../../LeftPanel/RoomAllocation/Roomcontext';
import { useJob } from '../../LeftPanel/JobAllocation/Jobcontext';

const OtherInfo = () => {
  const { allocatedRoom } = useRoom();
  const { allocatedJob, allocatedOrder } = useJob();
  const [info, setInfo] = useState(null);
  const [refreshCount] = useState(0);

  useEffect(() => {
    if (!allocatedRoom || !allocatedJob) return;

    const storedEquipments = JSON.parse(localStorage.getItem('registeredEquipments')) || [];

    Promise.all([
      fetch('/DB_records/Room.json').then(res => res.json()),
      fetch('/DB_records/Job.json').then(res => res.json()),
      fetch('/DB_records/Equipment.json').then(res => res.json())
    ])
      .then(([roomData, jobData]) => {
        const roomInfo = roomData.find(item => item.room === allocatedRoom);
        const jobInfo = jobData.find(item => item.job === allocatedJob);

        if (!roomInfo || !jobInfo) {
          setInfo(null);
          return;
        }

        const baseInfo = {
          room: allocatedRoom,
          job: allocatedJob,
          order: allocatedOrder,
          jobStatus: jobInfo["Job-status"],
          locationStatus: roomInfo["location-status"],
          printerStatus: jobInfo["Job-status"],
          printerName: 'N/A',
          workstation: 'N/A',
          workcenter: 'N/A',
          printerType: jobInfo["printertype"] || 'N/A'
        };

        if (storedEquipments.length === 0) {
          setInfo(baseInfo);
          return;
        }

        const getEquipmentByType = (types) =>
          storedEquipments.find(eq => types.includes(eq.equipment_type))?.equipment_name || 'N/A';

        const printerTypes = ['Label Printer', 'SU Printer', 'Roll Printer'];

        baseInfo.printerName = getEquipmentByType(printerTypes);
        baseInfo.workstation = getEquipmentByType(['Workstation']);
        baseInfo.workcenter = getEquipmentByType(['Workcenter']);

        setInfo(baseInfo);
      })
      .catch(err => {
        console.error("Error fetching data:", err);
        setInfo(null);
      });
  }, [allocatedRoom, allocatedJob, allocatedOrder, refreshCount]);

  return (
    <div className="other-info">
      {!allocatedJob ? (
        <div>No job allocated yet.</div>
      ) : !allocatedRoom ? (
        <div>Job is allocated. Now please allocate a room.</div>
      ) : !info ? (
        <div>Loading room and job info...</div>
      ) : (
        <>
          <div>
            <div><strong>Room:</strong> {info.room}</div>
            <div><strong>Job:</strong> {info.job}</div>
            <div><strong>Job Status:</strong> {info.jobStatus}</div>
          </div>

          <div>
            <div><strong>Order:</strong> {info.order}</div>
            <div><strong>Printer Name:</strong> {info.printerName}</div>
            <div><strong>Printer Type:</strong> {info.printerType}</div>
          </div>

          <div>
            <div><strong>Workstation:</strong> {info.workstation}</div>
            <div><strong>Workcenter:</strong> {info.workcenter}</div>
            <div><strong>Location Status:</strong> {info.locationStatus}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default OtherInfo;
