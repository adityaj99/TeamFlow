import React from "react";
import dateFormat from "../../utils/dateFormat";
import { getAvatar } from "../../utils/getAvatar";

const ProjectList = ({ projects = [], isLoading }) => {
  if (isLoading)
    return (
      <div className="flex flex-col gap-2 mt-4">
        {[1, 2, 3, 4, 5, 6].map((_, indx) => (
          <div key={indx} className="flex items-end justify-between p-2">
            <div className="flex flex-col gap-2">
              <div className="w-60 h-4 bg-gray-100 animate-pulse rounded"></div>
              <div className="w-35 h-4 bg-gray-100 animate-pulse rounded"></div>
            </div>
            <div className="w-35 h-4 bg-gray-100 animate-pulse rounded"></div>
          </div>
        ))}
      </div>
    );

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
                <p>{project.name}</p>
                <p className="text-gray-400">{dateFormat(project.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-end gap-2">
              <p className="text-gray-400">Created by</p>
              <img
                className="w-9 h-9 rounded-full object-cover"
                src={getAvatar(project.createdBy)}
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=User&background=random`;
                }}
                alt="avatar"
              />
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
