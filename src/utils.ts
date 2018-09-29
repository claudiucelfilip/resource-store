// Import stylesheets
export const columns = [
  'WriterString', 'Writer',
  'FirstReleaseYear', 'Released',
  'CreatedDate', 'Created Date',
  'RecordLabels', 'Record Lables',
  'MusicControls', 'Music Controls',
  'NotesCount', 'Notes',
  'SyncCollectablePercentage', '#',
  'AcquisitionLocation', 'Location',
  'RecordLabelGroup', 'Record Label Group',
  'PipsCode', 'Code'
];

export function getRandom(max) {
  return Math.floor(Math.random() * max);
}


export const symbol: any = new Proxy({}, {
  get: function(target, name: string) {
    return Symbol.for(name);
  }
});