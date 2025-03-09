import TileSection from "../components/TileSection";

import ActiveBanishes from "./misc/ActiveBanishes";
import BeatenUp from "./misc/BeatenUp";
import Copies from "./misc/Copies";
import Faxes from "./misc/Faxes";
import FreeFights from "./misc/FreeFights";
import FreeKills from "./misc/FreeKills";
import FreeRuns from "./misc/FreeRuns";
import FreeZones from "./misc/FreeZones";
import LuckyAdventures from "./misc/LuckyAdventures";
import Muffin from "./misc/Muffin";
import NoncombatForces from "./misc/NoncombatForces";
import Pulls from "./misc/Pulls";
import Wishes from "./misc/Wishes";
import AvantGuard from "./path/AvantGuard";
import FrumiousBandersnatch from "./resources/2009/FrumiousBandersnatch";
import DeckOfEveryCard from "./resources/2015/DeckOfEveryCard";
import PuckMan from "./resources/2015/PuckMan";
import DetectiveSchool from "./resources/2016/DetectiveSchool";
import Floundry from "./resources/2016/Floundry";
import ProtonicAcceleratorPack from "./resources/2016/ProtonicAcceleratorPack";
import SourceTerminal from "./resources/2016/SourceTerminal";
import Thanksgarden from "./resources/2016/Thanksgarden";
import AsdonMartin from "./resources/2017/AsdonMartin";
import TunnelOfLove from "./resources/2017/TunnelOfLove";
import VotingBooth from "./resources/2018/VotingBooth";
import Zatara from "./resources/2018/Zatara";
import KramcoSausageOMatic from "./resources/2019/KramcoSausageOMatic";
import CargoCultistShorts from "./resources/2020/CargoCultistShorts";
import Cartography from "./resources/2020/Cartography";
import CommerceGhost from "./resources/2020/CommerceGhost";
import Melodramedary from "./resources/2020/Melodramedary";
import PowerfulGlove from "./resources/2020/PowerfulGlove";
import BackupCamera from "./resources/2021/BackupCamera";
import ColdMedicineCabinet from "./resources/2021/ColdMedicineCabinet";
import DaylightShavingsHelmet from "./resources/2021/DaylightShavingsHelmet";
import EmotionChip from "./resources/2021/EmotionChip";
import IndustrialFireExtinguisher from "./resources/2021/IndustrialFireExtinguisher";
import UndergroundFireworksShop from "./resources/2021/UndergroundFireworksShop";
import Autumnaton from "./resources/2022/Autumnaton";
import CombatLoversLocket from "./resources/2022/CombatLoversLocket";
import Cookbookbat from "./resources/2022/Cookbookbat";
import CosmicBowlingBall from "./resources/2022/CosmicBowlingBall";
import CursedMagnifyingGlass from "./resources/2022/CursedMagnifyingGlass";
import DesignerSweatpants from "./resources/2022/DesignerSweatpants";
import GreyGoose from "./resources/2022/GreyGoose";
import JuneCleaver from "./resources/2022/JuneCleaver";
import JurassicParka from "./resources/2022/JurassicParka";
import MayDayPackage from "./resources/2022/MaydaySupplyPackage";
import ModelTrainSet from "./resources/2022/ModelTrainSet";
import TinyStillsuit from "./resources/2022/TinyStillsuit";
import UnbreakableUmbrella from "./resources/2022/UnbreakableUmbrella";
import AGuideToBurningLeaves from "./resources/2023/AGuideToBurningLeaves";
import AugustScepter from "./resources/2023/AugustScepter";
import BookOfFacts from "./resources/2023/BookOfFacts";
import CandyCaneSwordCane from "./resources/2023/CandyCaneSwordCane";
import CinchoDeMayo from "./resources/2023/CinchoDeMayo";
import ClosedCircuitPayPhone from "./resources/2023/ClosedCircuitPayPhone";
import CursedMonkeysPaw from "./resources/2023/CursedMonkeyPaw";
import JillOfAllTrades from "./resources/2023/JillOfAllTrades";
import MrStore2002Catalog from "./resources/2023/MrStore2002Catalog";
import PatrioticEagle from "./resources/2023/PatrioticEagle";
import RockGarden from "./resources/2023/RockGarden";
import SITCertificate from "./resources/2023/SITCourseCertificate";
import AprilingBandHelmet from "./resources/2024/AprilingBandHelmet";
import BatWings from "./resources/2024/BatWings";
import ChestMimic from "./resources/2024/ChestMimic";
import EverfullDartHolster from "./resources/2024/EverfullDartHolster";
import MayamCalendar from "./resources/2024/MayamCalendar";
import MiniKiwi from "./resources/2024/MiniKiwi";
import PeaceTurkey from "./resources/2024/PeaceTurkey";
import PhotoBooth from "./resources/2024/PhotoBooth";
import RomanCandelabra from "./resources/2024/RomanCandelabra";
import SeptEmberCenser from "./resources/2024/SeptEmberCenser";
import SpringShoes from "./resources/2024/SpringShoes";
import TakerSpace from "./resources/2024/TakerSpace";
import TearawayPants from "./resources/2024/TearawayPants";
import CyberRealm from "./resources/2025/CyberRealm";
import McHugeLargeDuffelBag from "./resources/2025/McHugeLargeDuffelBag";
import Numberology from "./resources/skill/Numberology";
import TranscendentOlfaction from "./resources/skill/TranscendentOlfaction";

// TODO: Organize by functionality, not release.
const ResourceSection = () => (
  <TileSection
    name="Resources"
    tiles={[
      ActiveBanishes,
      FreeFights,
      FreeZones,
      FreeKills,
      FreeRuns,
      Wishes,
      Faxes,
      Copies,
      NoncombatForces,
      TranscendentOlfaction,
      Numberology,
      LuckyAdventures,
      Pulls,

      /* 2009 */
      FrumiousBandersnatch,

      /* 2015 */
      DeckOfEveryCard,
      PuckMan,

      /* 2016 */
      Floundry,
      SourceTerminal,
      DetectiveSchool,
      ProtonicAcceleratorPack,
      Thanksgarden,

      /* 2017 */
      AsdonMartin,
      TunnelOfLove,

      /* 2018 */
      Zatara,
      VotingBooth,

      /* 2019 */
      KramcoSausageOMatic,

      /* 2020 */
      PowerfulGlove,
      Melodramedary,
      CargoCultistShorts,
      Cartography,
      CommerceGhost,

      /* 2021 */
      BackupCamera,
      EmotionChip,
      UndergroundFireworksShop,
      IndustrialFireExtinguisher,
      DaylightShavingsHelmet,
      ColdMedicineCabinet,

      /* 2022 */
      CursedMagnifyingGlass,
      CosmicBowlingBall,
      CombatLoversLocket,
      GreyGoose,
      UnbreakableUmbrella,
      MayDayPackage,
      JuneCleaver,
      DesignerSweatpants,
      TinyStillsuit,
      JurassicParka,
      Autumnaton,
      Cookbookbat,
      ModelTrainSet,

      /* 2023 */
      RockGarden,
      SITCertificate,
      ClosedCircuitPayPhone,
      CursedMonkeysPaw,
      CinchoDeMayo,
      MrStore2002Catalog,
      PatrioticEagle,
      AugustScepter,
      BookOfFacts,
      JillOfAllTrades,
      AGuideToBurningLeaves,
      CandyCaneSwordCane,

      /* 2024 */
      ChestMimic,
      SpringShoes,
      EverfullDartHolster,
      AprilingBandHelmet,
      MayamCalendar,
      MiniKiwi,
      RomanCandelabra,
      TearawayPants,
      SeptEmberCenser,
      BatWings,
      PhotoBooth,
      PeaceTurkey,
      TakerSpace,

      /* 2025 */
      CyberRealm,
      McHugeLargeDuffelBag,

      /* Nags only */
      BeatenUp,
      AvantGuard,
      Muffin,
    ]}
  />
);

export default ResourceSection;
