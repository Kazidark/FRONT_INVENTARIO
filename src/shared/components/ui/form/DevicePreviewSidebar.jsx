import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const DevicePreviewSidebar = ({
  deviceType = 'Dispositivo',
  centerIcon = 'pi pi-mobile',
  centerTitle = '',
  centerSubtitle = '',
  cards = [],
  chipLabel = '',
  chipIcon = 'pi pi-sim-card'
}) => {
  const rootRef = useRef(null);
  const visibleCards = (cards || []).filter((card) => String(card?.value || '').trim() !== '');

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const center = root.querySelector('.modem-preview-center-card');
    const cardNodes = root.querySelectorAll('.modem-preview-floating-card');
    const chip = root.querySelector('.modem-preview-chip');

    if (center) {
      gsap.fromTo(
        center,
        { y: 6, scale: 0.985 },
        { y: -2, scale: 1, duration: 2.8, repeat: -1, yoyo: true, ease: 'sine.inOut' }
      );
    }

    if (cardNodes.length > 0) {
      gsap.fromTo(
        cardNodes,
        { opacity: 0, y: 10, scale: 0.94 },
        { opacity: 1, y: 0, scale: 1, duration: 0.48, stagger: 0.06, ease: 'power2.out' }
      );
    }

    if (chip) {
      gsap.fromTo(chip, { opacity: 0, y: 8, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.42 });
    }

    return () => {
      gsap.killTweensOf(center);
      gsap.killTweensOf(cardNodes);
      gsap.killTweensOf(chip);
    };
  }, [visibleCards.length, chipLabel, centerTitle, centerSubtitle]);

  return (
    <aside ref={rootRef} className="ui-form-side modem-live-preview" aria-label={`Vista previa ${deviceType}`}>
      <div className="modem-preview-center-card">
        <div className="modem-preview-icon">
          <i className={centerIcon} />
        </div>
        <small>{deviceType}</small>
        <strong>{centerTitle || deviceType}</strong>
        <span>{centerSubtitle || 'Esperando datos'}</span>
      </div>

      {visibleCards.map((card) => (
        <div key={`${card.id}-${card.value}`} className="modem-preview-floating-card is-filled" data-card={card.id}>
          <i className={card.icon} />
          <span>{card.label}</span>
          <strong>{card.value}</strong>
        </div>
      ))}

      {chipLabel ? (
        <div className="modem-preview-chip">
          <i className={chipIcon} />
          <strong>{chipLabel}</strong>
        </div>
      ) : null}
    </aside>
  );
};

export default DevicePreviewSidebar;
