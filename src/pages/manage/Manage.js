import "./Manage.css";
import React, { useEffect, useState } from "react";
import Table from "../../components/table/Table";
import { connect } from "react-redux";
import { selectMember } from "../../redux/actions";
import Point from "../../components/point/Point";
import classes from "./Manage.module.css";
import ColumnEmail from "./columEmail/ColumnEmail";
import PageDesign from "../../components/pageDesign/PageDesign";
import history from "../../history";

const Manage = ({ members, selectMember }) => {
  const maxRole = 4;
  const [searchInput, setSearchInput] = useState("");
  const [currentMembers, setCurrentMembers] = useState([]);
  const maxRoleCount = members.reduce((preV, curV) => {
    return preV > curV.roles.length ? preV : curV.roles.length;
  }, 0);

  useEffect(() => {
    setCurrentMembers(members);
  }, [members]);
  const cssFlexRole =
    maxRoleCount <= maxRole ? (10 / maxRoleCount) * 0.1 : (10 / maxRole) * 0.1;

  const cssHeader = {
    textAlign: "left",
  };

  const compareIgnoreCase = (pre, post) => {
    return pre.toLocaleLowerCase().includes(post.toLocaleLowerCase());
  };

  useEffect(() => {
    if (searchInput && members.length) {
      const temp = members.filter(
        (mem) =>
          compareIgnoreCase(mem.user.email, searchInput) ||
          compareIgnoreCase(mem.user.name, searchInput) ||
          mem.roles.some((role) => compareIgnoreCase(role.name, searchInput))
      );
      setCurrentMembers(temp);
    } else {
      setCurrentMembers(members);
    }
  }, [members, searchInput]);

  const columns = {
    name: {
      key: "name",
      label: "name",
      width: "15%",
      cssHeader,
      cssData: {
        textTransform: "capitalize",
      },
      convertData: (userRole) => userRole.user.name,
    },
    email: {
      key: "email",
      label: "email",
      width: "35%",
      cssHeader,
      convertData: (userRole) => {
        return <ColumnEmail userRole={userRole} />;
      },
    },
    access: {
      key: "access",
      label: "access",
      width: "50%",
      cssHeader,
      convertData: (userRole) => {
        return (
          <div className={`${classes.access} ${classes.flex}`}>
            {userRole.roles
              .sort((ele1, ele2) => ele1.id - ele2.id)
              .map((role) => (
                <Point
                  color={`#${role.color}`}
                  pointSize="15"
                  title={role.name}
                  css={{
                    flexBasis: `calc(${cssFlexRole * 100}% - .7rem)`,
                    paddingBottom: ".7rem",
                  }}
                  key={role.id}
                />
              ))}
          </div>
        );
      },
    },
  };

  return (
    <PageDesign
      title="Admin"
      headerRight={
        <div className="manage__search page_design__animate__right">
          <input
            type="text"
            placeholder="Search members..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
      }
      css={{ paddingBottom: "10rem" }}
    >
      <Table
        columns={columns}
        data={currentMembers}
        onClickHandler={(element) => {
          selectMember(element);
          history.push(`/profile/${element.id}`);
        }}
      />
    </PageDesign>
  );
};
const mapStateToProp = (state) => {
  const { members } = state.members;
  return {
    members: members
      .sort((mem1, mem2) => (mem1.roles.length <= mem2.roles.length ? 1 : -1))
      .map((member) => {
        return { ...member };
      }),
  };
};
export default connect(mapStateToProp, {
  selectMember,
})(Manage);
