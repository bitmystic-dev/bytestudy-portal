export const PACKAGES = {
  CLASS_11_MATHS: 'class_11_maths',
  CLASS_11_PHYSICS: 'class_11_physics',
  CLASS_11_CHEMISTRY: 'class_11_chemistry',
  CLASS_11_MISC: 'class_11_misc',
  CLASS_12_MATHS: 'class_12_maths',
  CLASS_12_PHYSICS: 'class_12_physics',
  CLASS_12_CHEMISTRY: 'class_12_chemistry',
  CLASS_11_COMPLETE: 'class_11_complete',
  CLASS_12_COMPLETE: 'class_12_complete',
  CLASS_11_12_COMPLETE: 'class_11_12_complete',
  ALLEN_SPECIAL: 'allen_special_package'
};

export const PACKAGE_INCLUSIONS = {
  [PACKAGES.CLASS_11_COMPLETE]: [
    PACKAGES.CLASS_11_MATHS,
    PACKAGES.CLASS_11_PHYSICS,
    PACKAGES.CLASS_11_CHEMISTRY,
    PACKAGES.CLASS_11_MISC
  ],
  [PACKAGES.CLASS_12_COMPLETE]: [
    PACKAGES.CLASS_12_MATHS,
    PACKAGES.CLASS_12_PHYSICS,
    PACKAGES.CLASS_12_CHEMISTRY
  ],
  [PACKAGES.CLASS_11_12_COMPLETE]: [
    PACKAGES.CLASS_11_MATHS,
    PACKAGES.CLASS_11_PHYSICS,
    PACKAGES.CLASS_11_CHEMISTRY,
    PACKAGES.CLASS_11_MISC,
    PACKAGES.CLASS_12_MATHS,
    PACKAGES.CLASS_12_PHYSICS,
    PACKAGES.CLASS_12_CHEMISTRY,
    PACKAGES.CLASS_11_COMPLETE,
    PACKAGES.CLASS_12_COMPLETE
  ]
};

// Isolated Google Drive configuration for Account A (Main ByteStudy)
export const ACCOUNT_A_CONFIG = {
  accountName: 'ByteStudy Main Library',
  apiKey: import.meta.env.VITE_DRIVE_ACCOUNT_A_API_KEY || '',
  materials: {
    class11: {
      maths: {
        id: PACKAGES.CLASS_11_MATHS,
        name: 'Mathematics',
        classLevel: '11',
        icon: '📐',
        folderId: 'YOUR_CLASS_11_MATHS_FOLDER_ID',
        isAvailable: true
      },
      physics: {
        id: PACKAGES.CLASS_11_PHYSICS,
        name: 'Physics',
        classLevel: '11',
        icon: '⚡',
        folderId: 'YOUR_CLASS_11_PHYSICS_FOLDER_ID',
        isAvailable: true
      },
      chemistry: {
        id: PACKAGES.CLASS_11_CHEMISTRY,
        name: 'Chemistry',
        classLevel: '11',
        icon: '🧪',
        folderId: 'YOUR_CLASS_11_CHEMISTRY_FOLDER_ID',
        isAvailable: true
      },
      miscellaneous: {
        id: PACKAGES.CLASS_11_MISC,
        name: 'Miscellaneous Notes & Solved Papers',
        classLevel: '11',
        icon: '📚',
        folderId: 'YOUR_CLASS_11_MISC_FOLDER_ID',
        isAvailable: true
      }
    },
    class12: {
      maths: {
        id: PACKAGES.CLASS_12_MATHS,
        name: 'Mathematics',
        classLevel: '12',
        icon: '📐',
        folderId: '', // Empty means locked/coming soon
        isAvailable: false
      },
      physics: {
        id: PACKAGES.CLASS_12_PHYSICS,
        name: 'Physics',
        classLevel: '12',
        icon: '⚡',
        folderId: '',
        isAvailable: false
      },
      chemistry: {
        id: PACKAGES.CLASS_12_CHEMISTRY,
        name: 'Chemistry',
        classLevel: '12',
        icon: '🧪',
        folderId: '',
        isAvailable: false
      }
    }
  }
};

// Isolated Google Drive configuration for Account B (Allen Materials)
export const ACCOUNT_B_CONFIG = {
  accountName: 'Allen Academic Repository',
  apiKey: import.meta.env.VITE_DRIVE_ACCOUNT_B_API_KEY || '',
  materials: {
    allenClass11: {
      id: PACKAGES.ALLEN_SPECIAL,
      name: 'Allen Class 11 Special Modules',
      classLevel: '11',
      icon: '🎯',
      folderId: 'YOUR_ALLEN_CLASS_11_FOLDER_ID',
      isAvailable: true
    }
  }
};
