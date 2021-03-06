import React, { useEffect, useState } from "react";
import "./ReportList.css";
import Collapse from "../../../components/collapse/Collapse";
import timeCloudAPI from "../../../apis/timeCloudAPI";
import ReportItem from "../reportitem/ReportItem";

const ReportList = ({ user, projects = [] }) => {
  const [projectUsers, setProjectUsers] = useState([]);

  useEffect(() => {
    setProjectUsers(projects);
  }, [projects]);

  return (
    <div className="reportList">
      <Collapse selectMultiple={false}>
        {projectUsers
          .sort((projectUser1, projectUser2) =>
            projectUser1.project.name <= projectUser2.project.name ? -1 : 1
          )
          .map((projectUser) => (
            <ReportItem
              project={projectUser.project}
              user={user}
              isDoing={projectUser.isDoing}
              key={projectUser.project.id}
            />
          ))}
      </Collapse>
    </div>
  );
};

export default ReportList;
