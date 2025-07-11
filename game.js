import chalk from 'chalk';
import readlineSync from 'readline-sync';

class Player {
  constructor() {
    this.hp = 100;
    this.attackPower = 20;
  }

  attack(monster) {
    // 플레이어의 공격
    const damage = Math.floor(Math.random()*this.attackPower) + 1;
    monster.hp = Math.max(monster.hp - damage, 0);
    return damage;
  }
}

class Monster {
  constructor(stage) {
    this.hp = 50 + stage * 10;
    this.attackPower = 10 + stage;
  }

  attack(player) {
    // 몬스터의 공격
    const damage = Math.floor(Math.random()*this.attackPower) + 1;
    player.hp = Math.max(player.hp - damage, 0);
    return damage;
  }
}

function displayStatus(stage, player, monster) {
  console.log(chalk.magentaBright(`\n=== Current Status ===`));
  console.log(
    chalk.cyanBright(`| Stage:${stage} `) +
    chalk.blueBright(
      `| 플레이어 정보:${player.hp}`
    ) +
    chalk.redBright(
      `| 몬스터 정보:${monster.hp}`,
    ),
  );
  console.log(chalk.magentaBright(`=====================\n`));
}

const battle = async (stage, player, monster) => {
  let logs = [];

  while(player.hp > 0 && monster.hp > 0) {
    console.clear();
    displayStatus(stage, player, monster);

    logs.forEach((log) => console.log(log));

    console.log(chalk.green(`\n1. 공격한다 2. 도망친다.`));
    const choice = readlineSync.question('당신의 선택은? ');

    // 플레이어의 선택에 따라 다음 행동 처리
    switch(choice)  {
      case '1' : {
        const playerDamage = player.attack(monster);
        logs.push(`몬스터에게 ${playerDamage}의 피해를 입혔습니다.`);
        if(monster.hp<=0){
          logs.push('몬스터를 처치했습니다!');
          break;
        }
        const monsterDamage = monster.attack(player)
        logs.push(`몬스터가 ${monsterDamage}의 피해를 입혔습니다.`);
        break;
      }

      case '2' : {
         const escape = Math.random();
        if (escape < 0.5) {
          logs.push('도망치기 실패!');
          const monsterDamage = monster.attack(player);
          logs.push(`몬스터가 ${monsterDamage}의 피해를 입혔습니다.`);
        } else {
          logs.push('도망치기 성공!');
          return;
        }
        break;
      }
      default:
        console.log('"1"또는 "2"를 입력하세요.');
        break;
      }
    

    logs.push(chalk.green(`${choice}를 선택하셨습니다.`));
  }
  
};

export async function startGame() {
  console.clear();
  const player = new Player();
  let stage = 1;

  while (stage <= 10) {
    const monster = new Monster(stage);
    await battle(stage, player, monster);

    // 스테이지 클리어 및 게임 종료 조건
    if(player.hp<=0){
      console.log("Game Over!");
      return;
    }else{
      console.log("Stage Clear!");
      player.hp = Math.min(player.hp + 10, 100);
      console.log(`hp 10이 회복되어 현재 hp는 ${player.hp}입니다.`);
      readlineSync.question('다음 스테이지로 넘어가려면 엔터를 누르세요.');
      stage++;
    }
  }

  console.log('스테이지를 클리어 했습니다!');
}