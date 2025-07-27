// Mock ICE Reports Data for MigrAid
// Anonymous reporting system for community safety - San Francisco Bay Area

export const REPORT_TYPES = {
  ICE_ACTIVITY: 'ice_activity',
  CHECKPOINT: 'checkpoint',
  RAID: 'raid',
  SURVEILLANCE: 'surveillance',
  ARREST: 'arrest',
  PATROL: 'patrol',
};

export const REPORT_STATUS = {
  ACTIVE: 'active',
  RESOLVED: 'resolved',
  UNVERIFIED: 'unverified',
  VERIFIED: 'verified',
};

export const SEVERITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

export const mockIceReports = [
  {
    id: 'ice-1',
    type: REPORT_TYPES.ICE_ACTIVITY,
    status: REPORT_STATUS.ACTIVE,
    severity: SEVERITY_LEVELS.HIGH,
    location: {
      address: 'Near 16th & Mission BART Station',
      coordinates: {
        latitude: 37.7647,
        longitude: -122.4194
      },
      approximate: true
    },
    timestamp: '2025-01-20T08:30:00Z',
    description: 'Multiple unmarked vehicles observed near BART station during morning commute. Agents in tactical gear questioning people.',
    reportedBy: 'anonymous',
    verificationCount: 4,
    lastVerified: '2025-01-20T09:15:00Z',
    tags: ['transit', 'multiple_agents', 'morning_commute', 'mission_district'],
    isActive: true,
    communityNotes: [
      {
        id: 'note-1',
        timestamp: '2025-01-20T08:45:00Z',
        content: 'Confirmed - saw same vehicles. People avoiding BART entrance',
        anonymous: true
      },
      {
        id: 'note-2',
        timestamp: '2025-01-20T09:00:00Z',
        content: 'Activity moved towards 24th Street station',
        anonymous: true
      },
      {
        id: 'note-3',
        timestamp: '2025-01-20T09:30:00Z',
        content: 'Several people detained, families separated',
        anonymous: true
      }
    ]
  },
  {
    id: 'ice-2',
    type: REPORT_TYPES.CHECKPOINT,
    status: REPORT_STATUS.RESOLVED,
    severity: SEVERITY_LEVELS.CRITICAL,
    location: {
      address: 'Highway 101 Southbound near Cesar Chavez Exit',
      coordinates: {
        latitude: 37.7484,
        longitude: -122.3967
      },
      approximate: true
    },
    timestamp: '2025-01-19T14:20:00Z',
    description: 'Traffic checkpoint with document checks reported by multiple drivers. Long delays, multiple agents.',
    reportedBy: 'anonymous',
    verificationCount: 8,
    lastVerified: '2025-01-19T16:30:00Z',
    tags: ['highway', 'checkpoint', 'afternoon', 'document_checks'],
    isActive: false,
    resolvedAt: '2025-01-19T17:00:00Z',
    communityNotes: [
      {
        id: 'note-4',
        timestamp: '2025-01-19T15:00:00Z',
        content: 'Checkpoint causing major traffic backup. Multiple lanes blocked',
        anonymous: true
      },
      {
        id: 'note-5',
        timestamp: '2025-01-19T15:30:00Z',
        content: 'People being pulled over for document checks',
        anonymous: true
      },
      {
        id: 'note-6',
        timestamp: '2025-01-19T17:15:00Z',
        content: 'Checkpoint cleared, traffic returning to normal',
        anonymous: true
      }
    ]
  },
  {
    id: 'ice-3',
    type: REPORT_TYPES.SURVEILLANCE,
    status: REPORT_STATUS.ACTIVE,
    severity: SEVERITY_LEVELS.MEDIUM,
    location: {
      address: 'Fruitvale District near International Boulevard',
      coordinates: {
        latitude: 37.7749,
        longitude: -122.2247
      },
      approximate: true
    },
    timestamp: '2025-01-20T12:00:00Z',
    description: 'Increased surveillance vehicles in area known for immigrant-owned businesses and services.',
    reportedBy: 'anonymous',
    verificationCount: 3,
    lastVerified: '2025-01-20T13:30:00Z',
    tags: ['surveillance', 'business_district', 'midday', 'oakland'],
    isActive: true,
    communityNotes: [
      {
        id: 'note-7',
        timestamp: '2025-01-20T12:30:00Z',
        content: 'Unmarked vehicles parked for extended periods near mercado',
        anonymous: true
      },
      {
        id: 'note-8',
        timestamp: '2025-01-20T13:00:00Z',
        content: 'Agents photographing license plates in parking areas',
        anonymous: true
      }
    ]
  },
  {
    id: 'ice-4',
    type: REPORT_TYPES.RAID,
    status: REPORT_STATUS.VERIFIED,
    severity: SEVERITY_LEVELS.CRITICAL,
    location: {
      address: 'East San Jose residential area near King & Story',
      coordinates: {
        latitude: 37.3474,
        longitude: -121.8466
      },
      approximate: true
    },
    timestamp: '2025-01-20T06:00:00Z',
    description: 'Early morning activity at residential building. Multiple agents, vehicles blocking street.',
    reportedBy: 'anonymous',
    verificationCount: 5,
    lastVerified: '2025-01-20T07:30:00Z',
    tags: ['residential', 'early_morning', 'multiple_agents', 'san_jose'],
    isActive: false,
    resolvedAt: '2025-01-20T08:00:00Z',
    communityNotes: [
      {
        id: 'note-9',
        timestamp: '2025-01-20T06:15:00Z',
        content: 'Multiple families affected, children crying',
        anonymous: true
      },
      {
        id: 'note-10',
        timestamp: '2025-01-20T06:45:00Z',
        content: 'Street blocked, residents unable to leave for work',
        anonymous: true
      }
    ]
  },
  {
    id: 'ice-5',
    type: REPORT_TYPES.ICE_ACTIVITY,
    status: REPORT_STATUS.RESOLVED,
    severity: SEVERITY_LEVELS.HIGH,
    location: {
      address: 'Near San Francisco City Hall',
      coordinates: {
        latitude: 37.7792,
        longitude: -122.4191
      },
      approximate: true
    },
    timestamp: '2025-01-18T10:00:00Z',
    description: 'Agents observed outside courthouse during morning court sessions. People avoiding courthouse.',
    reportedBy: 'anonymous',
    verificationCount: 6,
    lastVerified: '2025-01-18T11:00:00Z',
    tags: ['courthouse', 'morning', 'multiple_sightings', 'civic_center'],
    isActive: false,
    resolvedAt: '2025-01-18T15:00:00Z',
    communityNotes: [
      {
        id: 'note-11',
        timestamp: '2025-01-18T10:30:00Z',
        content: 'Multiple people turned away from courthouse entrance',
        anonymous: true
      },
      {
        id: 'note-12',
        timestamp: '2025-01-18T11:30:00Z',
        content: 'Legal aid lawyers warning clients to stay away',
        anonymous: true
      }
    ]
  },
  {
    id: 'ice-6',
    type: REPORT_TYPES.PATROL,
    status: REPORT_STATUS.ACTIVE,
    severity: SEVERITY_LEVELS.MEDIUM,
    location: {
      address: 'Daly City BART Station area',
      coordinates: {
        latitude: 37.6879,
        longitude: -122.4702
      },
      approximate: true
    },
    timestamp: '2025-01-20T16:45:00Z',
    description: 'Increased patrol activity near BART station and surrounding residential streets.',
    reportedBy: 'anonymous',
    verificationCount: 2,
    lastVerified: '2025-01-20T17:30:00Z',
    tags: ['patrol', 'transit', 'afternoon', 'daly_city'],
    isActive: true,
    communityNotes: [
      {
        id: 'note-13',
        timestamp: '2025-01-20T17:00:00Z',
        content: 'Agents in plain clothes near bus stops',
        anonymous: true
      }
    ]
  },
  {
    id: 'ice-7',
    type: REPORT_TYPES.ARREST,
    status: REPORT_STATUS.VERIFIED,
    severity: SEVERITY_LEVELS.CRITICAL,
    location: {
      address: 'Richmond District near Geary Boulevard',
      coordinates: {
        latitude: 37.7749,
        longitude: -122.4896
      },
      approximate: true
    },
    timestamp: '2025-01-19T13:15:00Z',
    description: 'Witnessed arrest of individual walking to work. Multiple agents involved.',
    reportedBy: 'anonymous',
    verificationCount: 4,
    lastVerified: '2025-01-19T14:00:00Z',
    tags: ['arrest', 'midday', 'richmond', 'workplace_targeting'],
    isActive: false,
    resolvedAt: '2025-01-19T14:30:00Z',
    communityNotes: [
      {
        id: 'note-14',
        timestamp: '2025-01-19T13:30:00Z',
        content: 'Person was walking to restaurant job, family asking for help',
        anonymous: true
      },
      {
        id: 'note-15',
        timestamp: '2025-01-19T14:15:00Z',
        content: 'Legal aid contacted, working on case',
        anonymous: true
      }
    ]
  },
  {
    id: 'ice-8',
    type: REPORT_TYPES.SURVEILLANCE,
    status: REPORT_STATUS.ACTIVE,
    severity: SEVERITY_LEVELS.LOW,
    location: {
      address: 'Union City area near Alvarado Park',
      coordinates: {
        latitude: 37.5938,
        longitude: -122.0438
      },
      approximate: true
    },
    timestamp: '2025-01-20T11:30:00Z',
    description: 'Unmarked vehicle observed in area for several hours near community center.',
    reportedBy: 'anonymous',
    verificationCount: 1,
    lastVerified: '2025-01-20T12:30:00Z',
    tags: ['surveillance', 'community_center', 'morning', 'union_city'],
    isActive: true,
    communityNotes: []
  },
  {
    id: 'ice-9',
    type: REPORT_TYPES.CHECKPOINT,
    status: REPORT_STATUS.RESOLVED,
    severity: SEVERITY_LEVELS.HIGH,
    location: {
      address: 'Interstate 880 near Hegenberger Road exit',
      coordinates: {
        latitude: 37.7306,
        longitude: -122.1906
      },
      approximate: true
    },
    timestamp: '2025-01-17T07:00:00Z',
    description: 'Early morning checkpoint near airport. Multiple vehicles stopped and searched.',
    reportedBy: 'anonymous',
    verificationCount: 7,
    lastVerified: '2025-01-17T09:00:00Z',
    tags: ['checkpoint', 'early_morning', 'highway', 'airport_area'],
    isActive: false,
    resolvedAt: '2025-01-17T10:00:00Z',
    communityNotes: [
      {
        id: 'note-16',
        timestamp: '2025-01-17T07:30:00Z',
        content: 'Major traffic delays, people missing flights',
        anonymous: true
      },
      {
        id: 'note-17',
        timestamp: '2025-01-17T08:00:00Z',
        content: 'Several vehicles towed, people detained',
        anonymous: true
      }
    ]
  },
  {
    id: 'ice-10',
    type: REPORT_TYPES.ICE_ACTIVITY,
    status: REPORT_STATUS.UNVERIFIED,
    severity: SEVERITY_LEVELS.MEDIUM,
    location: {
      address: 'Near Safeway on Mission Street',
      coordinates: {
        latitude: 37.7444,
        longitude: -122.4194
      },
      approximate: true
    },
    timestamp: '2025-01-20T18:00:00Z',
    description: 'Possible agents questioning people in grocery store parking lot during evening hours.',
    reportedBy: 'anonymous',
    verificationCount: 0,
    lastVerified: null,
    tags: ['possible_activity', 'evening', 'grocery_store', 'mission'],
    isActive: true,
    communityNotes: []
  },
  {
    id: 'ice-11',
    type: REPORT_TYPES.RAID,
    status: REPORT_STATUS.VERIFIED,
    severity: SEVERITY_LEVELS.CRITICAL,
    location: {
      address: 'Apartment complex in Hayward near Southland Mall',
      coordinates: {
        latitude: 37.6688,
        longitude: -122.0808
      },
      approximate: true
    },
    timestamp: '2025-01-16T05:30:00Z',
    description: 'Pre-dawn raid at apartment complex. Multiple families affected, children present.',
    reportedBy: 'anonymous',
    verificationCount: 9,
    lastVerified: '2025-01-16T08:00:00Z',
    tags: ['raid', 'pre_dawn', 'families', 'children', 'hayward'],
    isActive: false,
    resolvedAt: '2025-01-16T09:00:00Z',
    communityNotes: [
      {
        id: 'note-18',
        timestamp: '2025-01-16T06:00:00Z',
        content: 'Over 12 agents, multiple vehicles blocking exits',
        anonymous: true
      },
      {
        id: 'note-19',
        timestamp: '2025-01-16T06:30:00Z',
        content: 'Children separated from parents, community organizing support',
        anonymous: true
      },
      {
        id: 'note-20',
        timestamp: '2025-01-16T08:30:00Z',
        content: 'Legal aid and community groups on scene providing assistance',
        anonymous: true
      }
    ]
  },
  {
    id: 'ice-12',
    type: REPORT_TYPES.PATROL,
    status: REPORT_STATUS.ACTIVE,
    severity: SEVERITY_LEVELS.LOW,
    location: {
      address: 'Mountain View Caltrain Station',
      coordinates: {
        latitude: 37.3893,
        longitude: -122.0759
      },
      approximate: true
    },
    timestamp: '2025-01-20T19:30:00Z',
    description: 'Increased security presence at Caltrain station during evening commute.',
    reportedBy: 'anonymous',
    verificationCount: 1,
    lastVerified: '2025-01-20T20:00:00Z',
    tags: ['patrol', 'transit', 'evening', 'mountain_view'],
    isActive: true,
    communityNotes: [
      {
        id: 'note-21',
        timestamp: '2025-01-20T19:45:00Z',
        content: 'More security than usual, people looking nervous',
        anonymous: true
      }
    ]
  }
];

// Safety and privacy utilities
export const anonymizeLocation = (coordinates) => {
  // Add slight randomization for privacy while maintaining general area accuracy
  const latOffset = (Math.random() - 0.5) * 0.01; // ~500m radius
  const lngOffset = (Math.random() - 0.5) * 0.01;
  
  return {
    latitude: coordinates.latitude + latOffset,
    longitude: coordinates.longitude + lngOffset,
    approximate: true
  };
};

export const getActiveReports = () => {
  return mockIceReports.filter(report => report && report.isActive);
};

export const getRecentReports = (hours = 24) => {
  const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
  return mockIceReports.filter(report => 
    report && report.timestamp && new Date(report.timestamp) > cutoff
  );
};

export const getReportsByType = (type) => {
  return mockIceReports.filter(report => report && report.type === type);
};

export const getReportsBySeverity = (severity) => {
  return mockIceReports.filter(report => report && report.severity === severity);
};

export const getVerifiedReports = () => {
  return mockIceReports.filter(report => report && typeof report.verificationCount === 'number' && report.verificationCount >= 2);
};

export const getCriticalReports = () => {
  return mockIceReports.filter(report => 
    report && report.severity === SEVERITY_LEVELS.CRITICAL && report.isActive
  );
};

export const getReportsNearLocation = (latitude, longitude, radiusKm = 10) => {
  return mockIceReports.filter(report => {
    if (!report || !report.location || !report.location.coordinates) {
      return false;
    }
    const distance = calculateDistance(
      latitude, longitude,
      report.location.coordinates.latitude, 
      report.location.coordinates.longitude
    );
    return distance <= radiusKm;
  });
};

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Report submission structure for new reports
export const createReportTemplate = () => ({
  id: null, // Will be generated
  type: '',
  status: REPORT_STATUS.UNVERIFIED,
  severity: SEVERITY_LEVELS.MEDIUM,
  location: {
    address: '',
    coordinates: null,
    approximate: true
  },
  timestamp: new Date().toISOString(),
  description: '',
  reportedBy: 'anonymous',
  verificationCount: 0,
  lastVerified: null,
  tags: [],
  isActive: true,
  communityNotes: []
});

export const getReportStats = () => {
  const total = mockIceReports.length;
  const active = getActiveReports().length;
  const recent = getRecentReports(24).length;
  const critical = getCriticalReports().length;
  
  return {
    total,
    active,
    recent,
    critical,
    byType: {
      [REPORT_TYPES.ICE_ACTIVITY]: getReportsByType(REPORT_TYPES.ICE_ACTIVITY).length,
      [REPORT_TYPES.CHECKPOINT]: getReportsByType(REPORT_TYPES.CHECKPOINT).length,
      [REPORT_TYPES.RAID]: getReportsByType(REPORT_TYPES.RAID).length,
      [REPORT_TYPES.SURVEILLANCE]: getReportsByType(REPORT_TYPES.SURVEILLANCE).length,
      [REPORT_TYPES.ARREST]: getReportsByType(REPORT_TYPES.ARREST).length,
      [REPORT_TYPES.PATROL]: getReportsByType(REPORT_TYPES.PATROL).length,
    },
    bySeverity: {
      [SEVERITY_LEVELS.LOW]: getReportsBySeverity(SEVERITY_LEVELS.LOW).length,
      [SEVERITY_LEVELS.MEDIUM]: getReportsBySeverity(SEVERITY_LEVELS.MEDIUM).length,
      [SEVERITY_LEVELS.HIGH]: getReportsBySeverity(SEVERITY_LEVELS.HIGH).length,
      [SEVERITY_LEVELS.CRITICAL]: getReportsBySeverity(SEVERITY_LEVELS.CRITICAL).length,
    }
  };
};

export default mockIceReports; 