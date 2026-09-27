import React, { useEffect } from 'react';
import { ArrowLeft, Volume2, VolumeX, Layers } from 'lucide-react';
import { ArchiveTerminal } from '../../components/ArchiveTerminal/ArchiveTerminal';
import { useSciFiSound } from '../../hooks/useSciFiSound';
import './about-page.css';

const ASCII_PORTRAIT = `:::: ::::........               .. . ..           .   ..  ..                         .                  .           .::   :         .-:::::-:::::
::::  ..:       .               ..   ..                                                                 .       .    ::   .         .::::::::::::
::::  ..:     . .  .            ..   ..                         .....:::::.::..  .::.......             ..      .    ..   .         .::::::::::::
::::.  .:       .  .          . ..   ..                     ..::::::-:::.....::::.....               .           .    ..       .  .    ...::::::::
:::-:  .:       .  .          . ..   ..                    ..::::::-:::.....::::.....               .           .    ..       .  .    ...::::::::
:::::   .       .          .    ..   ..            ..:....:---:..:::.   ..:::::::...............                .    .    .      .       :    :::
-::-: . .       .               ..   ..            ..::::-=--:. .:--------:::............::---:::..            ..               ..       : . .:::
:::::  ..                       ..   ..          .....:-=---:. ..::----::. ...            ..:---:::..          ..               ..   ..       :::
:::-:    .  ......       .     ..   ..        .:--:-----::.. ......:::..................   .  .. ....... ..     .  .----             :-.   .  :::
:::::     .  .:....             ..   ..      .::::::-::::...      .:---:..    ....      .      ....    ....     .   ::::             .-.   .    .
-::::     .  ..:::.:.           ..            ...::::...:....        ..:::.::::..        . .    ..      ...     .   :::.             .-.        .
:::-:.    .  .......            ..          .:::--:.. .:::::..   ....:::----:::.:...        . ..      ......        :.:       .      .:.      ..:
-----:    .  .:::::.                        :--::..  ..:::...       ...::::::::....           ::..      ..:..       . .       .      .:.      ...
-----::                       .            .:::.    ::...  .           ....::::......          .:....     .::.        .       .      .-.        .
:::::::                      .:           ..::::......   ....       .........:....          ...........    .:.        .     . .      :-.        .
:::-::: .          .        .:             :...:::..                    ..:..:::::...       ..::....:..   ..:.             . .      .:.        .
::::::: ..         .                .      .:   ........     ....     ...:..::..::.......      .--. ........:.              . .       :.   ::::::
:::::::::. . .  .  .          .           ....       ....    .           ..:....                -=-.     ....               . .       :.   --:--:
:::::::::... .     .                         ..      ....   .....       .....::::....           :==-.......:..              . .       ..   .----:
:::-:-::-::. .     .             .            ..      ..:..:......         ...........  .........-=-:........                 . .           ---::
:::::::::::. ..   .:......... .  ..           ...       ......         ....:::::----=--.  ......:-==-.  ....        .           .       .   :::::
:::::::::.   .   . .                .          ..     .-----:.......::----=======+++****+=-------=++=:  ..                 .  . .       :    ...:
::::::...    ..  . .        .    .. ...         ..    -+==--:....:--===++**********#####*++=--::..:-=-                 .   .    .       :       .
:::::        ..    .        .    .    ..         ..   =++=.       ....--=+***#**###*+=-:::::--===-:=- -:              .   .            :     ...
:::.   ..    :.    .             .. ....        --:.  =++=-------==-=--:---=++**##*++===-===+**+***++=.+=              :   .            .     ..:
::.   .:.    ..    .        :         ..       :-.==. =*===--::-:...:++---::-=+*%#*+==--=. ..+*=.:=++=-==              :    .::...:.             
:...  .:.    .     .        :         :.       :-:==- =*=-::...=+: .-%#=:::..:=+##+==+--==.:=#*+--=++==#:              :    .:....            :  
:. .   .           .        -         ..        --=::.++--:::::--===++++=:...:-+#*===+*=-==+**++++*++=:#:              :     ..........       :  
---:..::.          .        -         ..        .=-..:=+--------==+=++=-:::::-=+##*+++*#**+*####****+==*.              :     .........:..     .  
:::::::..          .        :         :.         :=-.-*=---=+=+++++++-:::::::=+##*+++*###***####**+==*=      ..       :.                     :  
::::::: .          .                  ..          -++-.=+----==+*++++-::::.::-=+##*+==+####%#####**+=+*.               ..                     :  
:::::-:            .        .   ..    ..           -==--+-----===++*=::::::::=+*%%%#*+++###%%%###*+==:.                ..    .       ..   :::::::
:::::::   ..  .::::::   .              .             ...==-:::--=++++=-:.==+===*%%#+**#+######**+++=-                  ..            ..   :::::::
:::-:::   .:. :-:::::....        .  . ..                :=-------=+++**+----::-=+*#*+=*####%#***++==.       .         ..            ..   :::----
--::--:    .  ..     ...                    .            -=----:-=====+===-:--=*++**+*****#****++++-         .      .  ..    . .:    ..    ::::-:
::::.....  .. ..     .                 .    .             -==-------=-=-------+*+-+*****++++*+++++-             .  .:::::    . .:    ..  .::::-::
::::.   .  .  ..  .  .      .          .    .     .       .-==--------=::--------==-===-::-=+++=+-       .            ..       .:    :..:::--::::
:::::. ..  .  ..  .  :      . .        .    .             .-:--------=-:. .:-==++=**#+==+*++++=-.        ..      .     . .......:    ...::::::-::
::::::     .. ..     .      .      .        .             .-:..:---:::----::-=+**+**+++**+++==-          ..      ..       .  . .:       :::::::::
:::::::::.           .      .      ..       .         .::.:-::....:--:::---=======++*****++=-=.          ..      .        .    .:  .    ..:::::-:
::::::.::...         .      .         .         ...:--:.  .-:.......:::::---==+***##%##*++--==.          ..               .    .: .-:   ..:::::::
::::.:.   ..                             ..::-------:     .::....... ..::::-==+****##**+=-=+==-=--::.                      .   .: .:.   :::::::::
::::... . ..  . .... .            .::---===+-:-=::--.     .:::.::::::.....::--========--=++==:=-=--+=-=--::.                   .:  .     :. ..:::
::.: ..   ..               ..::--=+=====-==..---:::=:  <ctrl42>....:::::-----::....:::------==-=+++=- -=-+::==-=+*++==---:::...        .:        ..   :.:
 . :      ..       ...:--==+=+========-:-=:.----:::=- .....:::::----=-:::.:::--+**+====+++==- .+=-=::==::-=+====++======-=--:....             . .
 . .      .::-=====+++=====+======++++=::=:-=:-=-.:-=:.:...::::-----==-::::::::-======++++=-- .+=-+-::==-::-++=-====+=++=====+*+-:.         ..:.:
.  .   .-=====++++=========++===+==+=+=-:--=-:-==:::-=...:.:::::---=====-::--===++*+++++===-:  ==-==:::==-:::-++==========-::=+=+++=:       :::::
     .-=-=++=----++++++===---=++====+++=:-+=::--=-::-=-..:::::::---===++=----=+++++=+++====-. .==-=+-::-==-----=++========-:-+=-+++++=-.      :::
   .:-::::--==++-:-+========-:-===--====-===:::--=-::-=-..:::::-----==++=-----======++=====. .===-+=-:::-===--:::=++======:.-+--=++===+=-.    :..
  -=---:...::--=+=:-+=-=======-:-=+========-:::----::::==...:::----::-=++==-----====+=====.  -=-=-+=:--::-=-----:::=+=====:.-+--====---=+=-.  . .
.---=====-:...:-=+=:-===-======-::-++=====+-:::--:--::::-=:.::::-------+*++========+==++-.. -===--+=----::===---::::=+====::=+:-======::+===-.  .
=----=+==++-:...:=+-:=++=========::-+++===+-::-==:--------==-:-=--===--=+****++=====++=-...-==+==+==---=:::=+===-::::-=++=-:-+:-===-==:-+===+=-. 
----::-=+====-:..:-=::===+====-===:::=+====-:::-=-:==----::----====++++++*****+===++=::. :=====-==---:-=-:.:=+==--:::::-=+=:-+-:=---=-.-+=-=====-
----::::-=+====-:..--.-=-:=+==-====:::-++=+-:::---::-=--=---::-====+++*****+**++=--:....=====-====-----==-::-++==---:::::-=--+=:---==::=+=-======
------::::-======-..-.:==::====-===-:::-====-:---=-::-+=--=-:::::-=====+++++=--:.....:======-===-------===:::-++==----::::---=-.--==:.-==--==-===
---===--:::::===-=-:.::-=-.:========-:::-===--::----::-+=---=--:::::--=---::::..::-======--=====-------=---:::-++==---::::::-==.--=:.:=---==--==-
---::-=+=--::::====-:.:===:.:=+======-:---===--------::-=+=-:-----:::::----====-=---=---==+=--=-------====--:::-+====----:::-==.--=:.:=---==--==-
--:-:::--==--::::-==-..-=+=..:=+======----==---::-----:::-++=-:::-==----:::--:--------===+=--=---:-----==-=--:::-++++=----:::==.--..-----::-=-:--
----::::::-===--::::=- :===:..:=++====----==--:-::----:::::=+==-::::-------------==-----==+=--=---:-----==-=--:::-++++=----:::==.---.:----=--:-=--
-------:::.::--=-==:.::.-==-..::=+++===----=---:--------::::-++++=-::::::::-----------=++=-------------=====--::::-=====-----==...:--:::---:..==-
----======---::::-==-...-===...::=+++====---------------::::::-=*++==--::::::::::----====---------------=====-:::::-++==----:--=. .::::::::..-----
--:::::::-------=--:::. :===:.:..--========-----:---------:::::--===+====-----------====----------------======--::.:-===------=..:::::..:..--::--
-:-----------::----==-:  -==:....:--=========--------------::..:--=====================------------------==-===--::::-===--::--...::......:-::---
-:---::::::-----------=-.:-=-.....:----=---==----------------:::::---------===-------=--------------------=-=--=---:::--------:.........::-:---::`;

export const AboutPage = ({ onNavigateHome, onNavigateArtifacts, onNavigateFuture, onNavigateContact }) => {
  const { soundEnabled, toggleSound, playSound } = useSciFiSound();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleTerminalNav = (sectionId) => {
    if (sectionId === 'home') {
      onNavigateHome?.();
    } else if (sectionId === 'artifacts') {
      onNavigateArtifacts?.();
    } else if (sectionId === 'future') {
      onNavigateFuture?.();
    } else if (sectionId === 'contact') {
      onNavigateContact?.();
    }
  };

  return (
    <div className="about-page-root">
      {/* Top Header Navigation Bar */}
      <header className="about-header-bar">
        <div className="header-badge">
          <span className="hud-square">■</span> AK // ARCHIVE — IDENTITY RECORD 001
        </div>

        <div className="header-right-actions">
          {/* Artifacts Shortcut Button */}
          <button
            type="button"
            className="header-nav-btn"
            onClick={() => {
              playSound?.('type_char');
              onNavigateArtifacts?.();
            }}
          >
            <Layers size={13} />
            <span>ARTIFACTS</span>
          </button>

          <button
            type="button"
            className="header-nav-btn"
            onClick={() => {
              playSound?.('type_char');
              onNavigateFuture?.();
            }}
          >
            <span>FUTURE</span>
          </button>

          <button
            type="button"
            className="header-nav-btn"
            onClick={() => {
              playSound?.('type_char');
              onNavigateContact?.();
            }}
          >
            <span>CONTACT</span>
          </button>

          {/* Audio Toggle Button */}
          <button
            type="button"
            className="header-nav-btn audio-btn"
            onClick={() => {
              playSound?.('type_char');
              toggleSound?.();
            }}
            title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
          >
            {soundEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
            <span>{soundEnabled ? 'AUDIO: ON' : 'AUDIO: OFF'}</span>
          </button>

          {/* Return to Hero Space Button */}
          <button
            type="button"
            className="header-back-btn"
            onClick={() => {
              playSound?.('type_char');
              onNavigateHome?.();
            }}
          >
            <ArrowLeft size={14} />
            <span>RETURN TO HERO SPACE</span>
          </button>
        </div>
      </header>

      {/* Main Identity Record Body */}
      <main className="about-page-main">
        <div className="about-container">
          {/* Left Column — ASCII Portrait */}
          <div className="about-left-col">
            <div className="identity-scan-header">
              <span className="hud-square">■</span> IDENTITY SCAN // 001
            </div>

            <div className="ascii-portrait-container">
              <pre className="ascii-portrait">
                {ASCII_PORTRAIT}
              </pre>
            </div>

            <div className="ascii-metadata">
              <div className="meta-row">
                <span>IMAGE RECONSTRUCTION</span>
                <span className="meta-dots">........</span>
                <span className="meta-val">100%</span>
              </div>
              <div className="meta-row">
                <span>IDENTITY MATCH</span>
                <span className="meta-dots">..............</span>
                <span className="meta-val highlight">VERIFIED</span>
              </div>
              <div className="meta-row">
                <span>SOURCE</span>
                <span className="meta-dots">......................</span>
                <span className="meta-val">LOCAL ARCHIVE</span>
              </div>
            </div>
          </div>

          {/* Right Column — Personal Record */}
          <div className="about-right-col">
            <div className="person-name-block">
              <h1 className="person-name">ARYAN KATE</h1>
              <div className="person-role">BUILDER / ENGINEER / EXPERIMENTER</div>
            </div>

            <div className="person-bio">
              <p>
                I build software from ideas<br />
                from the first sketch to something people can actually use.
              </p>
              <p>
                I've worked across full-stack development,<br />
                AI integration, interfaces and product experiments —<br />
                often learning whatever the problem demands.
              </p>
              <p>
                This archive is a record of that process.
              </p>
              <div className="bio-bullet-list">
                <div>Things built.</div>
                <div>Things broken.</div>
                <div>Things learned.</div>
                <div>Things still being imagined.</div>
              </div>
            </div>

            {/* Current State Metadata Box */}
            <div className="current-state-box">
              <div className="state-header">
                <span>CURRENT STATE</span>
                <span className="header-divider" />
              </div>
              <div className="state-table">
                <div className="state-row">
                  <span className="state-key">ACADEMIC</span>
                  <span className="state-val">3RD YEAR • CSE-DS • 9.17 SGPA</span>
                </div>
                <div className="state-row">
                  <span className="state-key">INTERESTS</span>
                  <span className="state-val">AI / SOFTWARE / PRODUCTS</span>
                </div>
                <div className="state-row">
                  <span className="state-key">MODE</span>
                  <span className="state-val">BUILDING</span>
                </div>
                <div className="state-row">
                  <span className="state-key">STATUS</span>
                  <span className="state-val status-online">
                    ONLINE <span className="green-pulse-dot" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Moveable Mac Archive Terminal */}
      <ArchiveTerminal
        onNavigateSection={handleTerminalNav}
        playSound={playSound}
      />
    </div>
  );
};
