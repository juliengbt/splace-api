import Category from 'src/models/category/category.entity';
import { faker } from '@faker-js/faker';
import Sport from 'src/models/sport/sport.entity';

export const fakeCategory = (): Category => {
  return {
    code: faker.lorem.word(8),
    name: faker.lorem.words(3)
  };
};

export const fakeSport = (c?: Category): Sport => {
  return {
    code: faker.lorem.word(8),
    name: faker.lorem.words(3),
    alias: faker.lorem.words(10).replaceAll(' ', ';'),
    description: faker.lorem.paragraph(2),
    federation: faker.lorem.words(3),
    category: c || fakeCategory()
  };
};
/**
 * Generate an array of 10 sport entities
 * @returns Array of sports
 */
export const fakeSports = (): Sport[] => {
  const categories = [...Array(5).keys()].map(fakeCategory);

  return [...Array(10).keys()].map(() =>
    fakeSport(categories[Math.floor(Math.random() * categories.length)])
  );
};
