# Acceptance — Overrides

Acceptance scenarios in Given/When/Then format for the `htmlentityswaper.overrides`
setting, which allows adding, replacing, or disabling a mapping using the `key === value`
format.

## Add a character

- Given an override mapping a character absent from the default map to an HTML entity,
- when the user runs a replacement,
- then that character is now replaced by the provided entity.

## Override a mapping

- Given an override mapping a character already present in the default map to a different
  entity,
- when the user runs a replacement,
- then that character is replaced by the override's entity, not by the default one.

## Disable a mapping

- Given an override mapping a character from the default map to an empty value,
- when the user runs a replacement,
- then that character is no longer replaced.

## Immediate pickup

- Given an entity map already built for the session,
- when the user changes the `htmlentityswaper.overrides` setting,
- then the next replacement reflects the new configuration, with no window reload.
