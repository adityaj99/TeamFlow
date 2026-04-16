import React from "react";

const ProjectList = () => {
  const projects = [
    {
      _id: 1,
      title: "Automation Quality Inspection System",
      date: "Janunary 11th 2026",
      createdBy: "Aditya J",
    },
    {
      _id: 2,
      title: "Automation Quality Inspection System",
      date: "Janunary 11th 2026",
      createdBy: "Aditya J",
    },
    {
      _id: 3,
      title: "Automation Quality Inspection System",
      date: "Janunary 11th 2026",
      createdBy: "Aditya J",
    },
    {
      _id: 4,
      title: "Automation Quality Inspection System",
      date: "Janunary 11th 2026",
      createdBy: "Aditya J",
    },
    {
      _id: 5,
      title: "Automation Quality Inspection System",
      date: "Janunary 11th 2026",
      createdBy: "Aditya J",
    },
    {
      _id: 6,
      title: "Automation Quality Inspection System",
      date: "Janunary 11th 2026",
      createdBy: "Aditya J",
    },
  ];

  return (
    <div className="flex flex-col mt-4">
      {projects?.length > 0 ? (
        projects?.map((project, index) => (
          <div
            key={project._id}
            className="flex items-end justify-between p-2 border-b border-gray-200"
          >
            <div className="flex gap-2">
              <p>{index + 1 + "."}</p>
              <div className="flex flex-col">
                <p>{project.title}</p>
                <p className="text-gray-400">{project.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-gray-400">Created by</p>
              <p>{project.createdBy}</p>
            </div>
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center text-gray-400 p-6">
          <p>There is no project yet.</p>
          <p>Please create for workspace.</p>
        </div>
      )}
    </div>
  );
};

export default ProjectList;
