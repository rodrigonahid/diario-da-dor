import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { eq } from 'drizzle-orm';
import { users, painEntries, treatmentForms } from '../src/lib/db/schema.ts';

const sqlite = new Database('./sqlite.db');
const db = drizzle(sqlite);

const bodyParts = ['cabeca', 'pescoco', 'ombro', 'costas', 'quadril', 'perna', 'pes'];

const symptoms = [
  'Dor latejante que piora com movimento',
  'Sensação de queimação constante',
  'Dor em pontada que vem e vai',
  'Rigidez muscular pela manhã',
  'Dor que irradia para outras regiões',
  'Formigamento e dormência',
  'Dor que piora à noite',
  'Sensação de peso e cansaço'
];

const durations = [
  'menos-1-dia',
  '1-3-dias',
  '1-semana',
  '2-4-semanas',
  '1-3-meses',
  'mais-3-meses'
];

const triggers = [
  'Movimento brusco durante exercício',
  'Postura inadequada no trabalho',
  'Carregar peso excessivo',
  'Dormir em posição ruim',
  'Estresse e tensão',
  'Mudança no clima',
  'Atividade física intensa',
  'Ficar muito tempo na mesma posição'
];

const treatments = [
  'Compressas quentes',
  'Massagem local',
  'Repouso absoluto',
  'Alongamentos leves',
  'Fisioterapia',
  'Acupuntura',
  'Exercícios de fortalecimento',
  'Relaxamento muscular'
];

const medications = [
  'Ibuprofeno 600mg',
  'Paracetamol 750mg',
  'Diclofenaco sódico',
  'Relaxante muscular',
  'Anti-inflamatório tópico',
  'Dipirona 500mg',
  'Naproxeno',
  'Pomada analgésica'
];

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomPainLevel() {
  return Math.floor(Math.random() * 10) + 1;
}

function getRandomDate(daysAgo) {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date;
}

async function seedData() {
  try {
    console.log('🌱 Iniciando seed de dados...');

    // Verificar se usuário já existe
    let testUser = await db.select().from(users).where(eq(users.phone, '11999887766'));
    
    if (testUser.length === 0) {
      // Criar usuário de teste
      const newUser = await db.insert(users).values({
        name: 'João Silva',
        phone: '11999887766',
      }).returning();
      testUser = newUser;
      console.log(`✅ Usuário criado: ${testUser[0].name} (ID: ${testUser[0].id})`);
    } else {
      console.log(`✅ Usuário já existe: ${testUser[0].name} (ID: ${testUser[0].id})`);
    }

    // Criar 15 entradas da dor aleatórias
    const painEntryPromises = [];
    
    for (let i = 0; i < 15; i++) {
      const bodyPart = getRandomItem(bodyParts);
      const painLevel = getRandomPainLevel();
      const createdAt = getRandomDate(30); // Últimos 30 dias

      const painEntryPromise = db.insert(painEntries).values({
        userId: testUser[0].id,
        bodyPart,
        painLevel,
        createdAt,
      }).returning();

      painEntryPromises.push(painEntryPromise);
    }

    const createdPainEntries = await Promise.all(painEntryPromises);
    console.log(`✅ ${createdPainEntries.length} entradas da dor criadas`);

    // Criar formulários de tratamento para algumas entradas (70% das entradas)
    const treatmentFormPromises = [];

    for (const [painEntry] of createdPainEntries) {
      if (Math.random() > 0.3) { // 70% chance de ter formulário
        const formData = {
          symptoms: getRandomItem(symptoms),
          duration: getRandomItem(durations),
          triggers: getRandomItem(triggers),
          previousTreatments: getRandomItem(treatments),
          medications: Math.random() > 0.5 ? getRandomItem(medications) : '',
          notes: Math.random() > 0.6 ? 'Observações adicionais sobre o tratamento e evolução da dor.' : ''
        };

        const treatmentFormPromise = db.insert(treatmentForms).values({
          painEntryId: painEntry.id,
          formData: JSON.stringify(formData),
        });

        treatmentFormPromises.push(treatmentFormPromise);
      }
    }

    await Promise.all(treatmentFormPromises);
    console.log(`✅ ${treatmentFormPromises.length} formulários de tratamento criados`);

    console.log('\n🎉 Seed concluído com sucesso!');
    console.log('\n📋 Dados criados:');
    console.log(`   👤 Usuário: João Silva (Telefone: 11999887766)`);
    console.log(`   📊 ${createdPainEntries.length} registros da dor`);
    console.log(`   📝 ${treatmentFormPromises.length} formulários de tratamento`);
    console.log('\n🔗 Acesse: http://localhost:3001');
    console.log('   Use o telefone "11999887766" para fazer login');

  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
  } finally {
    sqlite.close();
  }
}

seedData();
