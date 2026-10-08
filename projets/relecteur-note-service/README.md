---
titre: Relecteur de note de service
resume: Relit une note de service fictive ou anonymisée et signale les fautes, les ambiguïtés et les passages à clarifier, sans réécrire à votre place.
type: prompt
usage: redaction
ia_compatibles: [toutes]
langue: fr
niveau: debutant
statut: relu
version: 1.0
donnees: exemples-fictifs
filiation: original
version_plus_recente: aucune
licence: "[à définir]"
etiquettes: [relecture, note, style]
controles: [aucune-donnee-reelle, exemples-fictifs, aucun-nom-adresse, aucun-appel-reseau]
auteur: "Exemple (auteur fictif)"
relu_par: "Exemple (relecteur fictif)"
---

## Le problème résolu

Une note de service doit être comprise du premier coup. Après plusieurs relectures, l'auteur ne voit plus ses propres ambiguïtés : phrase trop longue, sigle non expliqué, ordre donné sans échéance.

Ce prompt joue le rôle d'un relecteur extérieur. Il liste les problèmes, par ordre d'importance, et laisse la rédaction finale à l'auteur.

## Entrées et sorties

- **Ce que vous donnez** : le texte de la note, collé dans la conversation, après avoir retiré tout nom, adresse ou information réelle.
- **Ce que vous recevez** : une liste de remarques classées (clarté, structure, orthographe), chacune avec la phrase concernée et une piste de correction. Rien n'est réécrit sans votre demande.

Un exemple complet se trouve dans `exemples/` : `texte-fictif.md` en entrée, `retour-attendu.md` en sortie.

## Limites connues

- L'IA ne connaît pas le contexte réel de la note : elle peut juger ambigu un terme que ses destinataires comprennent.
- Elle ne vérifie pas l'exactitude des faits ni des dates.
- Les règles de rédaction propres à votre structure ne sont pas connues d'elle, sauf si vous les ajoutez au prompt.
- Ne collez jamais une note réelle : anonymisez d'abord.

## Pour adapter ce projet

Ajoutez à la fin du prompt vos propres règles de rédaction (longueur maximale, formules imposées), toujours sans donnée sensible.
