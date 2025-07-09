import React, { createContext, useContext, useState, useEffect } from 'react';

type Membership = {
  group_id: number;
  group_name: string;
  username: string;
  role: string;
};

const GroupContext = createContext<any>(null);

export function GroupProvider({ children }: { children: React.ReactNode }) {
  const [memberships, setMemberships] = useState<Membership[]>(() => {
    const m = localStorage.getItem('memberships');
    return m ? JSON.parse(m) : [];
  });
  // Auto-select group if only one membership exists
  const [selectedGroup, setSelectedGroup] = useState<Membership | null>(() => {
    const sg = localStorage.getItem('selectedGroup');
    if (sg) return JSON.parse(sg);
    const m = localStorage.getItem('memberships');
    if (m) {
      const memberships = JSON.parse(m);
      if (memberships.length === 1) return memberships[0];
    }
    return null;
  });

  useEffect(() => {
    if (memberships.length > 0) {
      localStorage.setItem('memberships', JSON.stringify(memberships));
      // If only one group, auto-select it
      if (memberships.length === 1) {
        setSelectedGroup(memberships[0]);
        localStorage.setItem('selectedGroup', JSON.stringify(memberships[0]));
      }
    }
  }, [memberships]);

  useEffect(() => {
    if (selectedGroup) {
      localStorage.setItem('selectedGroup', JSON.stringify(selectedGroup));
    }
  }, [selectedGroup]);

  return (
    <GroupContext.Provider value={{ memberships, setMemberships, selectedGroup, setSelectedGroup }}>
      {children}
    </GroupContext.Provider>
  );
}

export function useGroup() {
  return useContext(GroupContext);
} 