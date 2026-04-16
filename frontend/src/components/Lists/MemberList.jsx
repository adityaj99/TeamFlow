import React from "react";

const MemberList = () => {
  const members = [
    {
      _id: 1,
      name: "Aditya Jadhav",
      role: "owner",
      createdAt: "Janunary 11th 2026",
    },
    {
      _id: 2,
      name: "Emma Watson",
      role: "manager",
      createdAt: "February 16th 2026",
    },
    {
      _id: 3,
      name: "Adam Web",
      role: "member",
      createdAt: "Janunary 20th 2026",
    },
    {
      _id: 4,
      name: "Emily Santner",
      role: "member",
      createdAt: "March 01st 2026",
    },
  ];

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
              <p>{member.createdAt}</p>
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
