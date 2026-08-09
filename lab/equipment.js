// ChemLab Equipment Registry V1

export const equipmentRegistry = {
  test_tube: {
    name: '试管',
    category: 'glassware'
  },
  alcohol_lamp: {
    name: '酒精灯',
    category: 'heating'
  },
  iron_stand: {
    name: '铁架台',
    category: 'support'
  },
  gas_jar: {
    name: '集气瓶',
    category: 'collection'
  }
};

export function getEquipment(id) {
  return equipmentRegistry[id];
}
