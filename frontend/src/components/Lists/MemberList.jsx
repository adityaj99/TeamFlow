import React from "react";
import dateFormat from "../../utils/dateFormat";

const MemberList = ({ members = [], isLoading }) => {
  if (isLoading)
    return (
      <div className="flex flex-col gap-2 mt-4">
        {[1, 2, 3, 4, 5, 6].map((_, indx) => (
          <div key={indx} className="flex items-center justify-between p-2">
            <div className="flex gap-2">
              <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse"></div>
              <div className="flex flex-col gap-2">
                <div className="w-60 h-4 bg-gray-100 animate-pulse rounded"></div>
                <div className="w-30 h-4 bg-gray-100 animate-pulse rounded"></div>
              </div>
            </div>

            <div className="flex flex-col gap-2 mr-6">
              <div className="w-15 h-4 bg-gray-100 animate-pulse rounded"></div>
              <div className="w-25 h-4 bg-gray-100 animate-pulse rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );

  return (
    <div className="flex flex-col mt-4 gap-2">
      {members?.length > 0 ? (
        members?.map((member) => (
          <div
            key={member._id}
            className="flex justify-between p-2 border border-gray-200 rounded-lg"
          >
            <div className="flex gap-2 w-[87%]">
              <div className="h-9 w-9 rounded-full bg-blue-400"></div>
              <div className="flex flex-col">
                <p>{member.name}</p>
                <p className="text-gray-400 uppercase">{member.role}</p>
              </div>
            </div>
            <div className="flex flex-col items-start w-[13%] text-gray-400">
              <p>Joined</p>
              <p>{dateFormat(member.createdAt)}</p>
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

export default MemberList;
