import {Component, ElementRef, HostBinding, HostListener, OnInit, ViewChild} from '@angular/core';
import {Script} from '../classes/script.class';
import Quill from 'quill';

@Component({
  selector: 'app-sympl-text',
  templateUrl: './sympl-text.component.html',
  styleUrls: ['./sympl-text.component.scss']
})
export class SymplTextComponent {
  constructor() {
    const Parchment = Quill.import('parchment');
    const keyAttributor = new Parchment.Attributor.Attribute('key', 'data-key', {
      scope: Parchment.Scope.BLOCK
    });
    const elementAttributor = new Parchment.Attributor.Attribute('key', 'data-key', {
      scope: Parchment.Scope.INLINE
    });
    Quill.register(keyAttributor);
    Quill.register(elementAttributor);
    const Block = Quill.import('blots/block');
    const Inline = Quill.import('blots/inline');
    const Container = Quill.import('blots/container');
    class Page extends Container {
      static create( value ) {
        console.log('creating');
        const node = super.create();
        node.setAttribute('class', 'page');
        const heading = Heading.create();
        node.appendChild(heading);
        /*if (!node.getAttribute('data-key')) {
          node.setAttribute('data-key', Script.generateId());
        }*/
        return node;
      }
      static formats(domNode) {
        return true;
      }
    }
    class Heading extends Block {
      static create() {
        console.log('creating');
        const node = super.create();
        node.setAttribute('class', 'heading');
        /*if (!node.getAttribute('data-key')) {
          node.setAttribute('data-key', Script.generateId());
        }*/
        return node;
      }
      static formats(domNode) {
        return true;
      }
    }
    class Transition extends Block {
      static create() {
        const node = super.create();
        node.setAttribute('class', 'transition');
        /*if ( !node.getAttribute('data-key') ) {
          node.setAttribute('data-key', Script.generateId() );
        }*/
        return node;
      }
      static formats(domNode) { return true; }
    }
    class Parenthetical extends Block {
      static create() {
        const node = super.create();
        node.setAttribute('class', 'parenthetical');
        /*if ( !node.getAttribute('data-key') ) {
          node.setAttribute('data-key', Script.generateId() );
        }*/
        return node;
      }
      static formats(domNode) { return true; }
    }
    class Shot extends Block {
      static create() {
        const node = super.create();
        node.setAttribute('class', 'shot');
        if ( !node.getAttribute('data-key') ) {
          node.setAttribute('data-key', Script.generateId() );
        }
        return node;
      }
      static formats(domNode) { return true; }
    }
    class Element extends Inline {
      static create() {
        const node = super.create();
        node.setAttribute('class', 'element');
        if ( !node.getAttribute('data-key') ) {
          node.setAttribute('data-key', Script.generateId() );
        }
        return node;
      }
      static formats(domNode) { return true; }
    }
    class PageBreak extends Block {
      static create() {
        const node = super.create();
        node.contentEditable = 'false';
        node.setAttribute('class', 'pagebreak');
        return node;
      }
      format(name, value) {
        if (name === 'pagebreak' && !value) {
          console.log( this.domNode );
          super.remove();
        }
      }
      static formats(domNode) { return true; }
    }
    class General extends Block {
      static create() {
        const node = super.create();
        node.setAttribute('class', 'general');
        if ( !node.getAttribute('data-key') ) {
          node.setAttribute('data-key', Script.generateId() );
        }
        return node;
      }
      static formats(domNode) { return true; }
    }
    class Action extends Block {
      static create() {
        const node = super.create();
        node.setAttribute('class', 'action');
        /*if ( !node.getAttribute('data-key') ) {
          node.setAttribute('data-key', Script.generateId() );
        }*/
        return node;
      }
      static formats(domNode) { return true; }
    }
    class Character extends Block {
      static create() {
        const node = super.create();
        node.setAttribute('class', 'character');
        if ( !node.getAttribute('data-key') ) {
          node.setAttribute('data-key', Script.generateId() );
        }
        return node;
      }
      static formats(domNode) { return true; }
    }
    class Dialogue extends Block {
      public static fs;
      static create() {
        const node = super.create();
        node.setAttribute('class', 'dialogue');
        if ( !node.getAttribute('data-key') ) {
          node.setAttribute('data-key', Script.generateId() );
        }
        return node;
      }
      static formats(domNode) { return true; }
    }
    Page.allowedChildren = [Heading, Action];
    Page.blotName = 'page';
    Page.className = 'page';
    General.blotName = 'general';
    General.className = 'general';
    Element.blotName = 'element';
    Element.className = 'element';
    PageBreak.blotName = 'pagebreak';
    PageBreak.className = 'pagebreak';
    Heading.blotName = 'heading';
    Heading.className = 'heading';
    Transition.blotName = 'transition';
    Transition.className = 'transition';
    Parenthetical.blotName = 'parenthetical';
    Parenthetical.className = 'parenthetical';
    Shot.blotName = 'shot';
    Shot.className = 'shot';
    Action.blotName = 'action';
    Action.className = 'action';
    Character.blotName = 'character';
    Character.className = 'character';
    Dialogue.blotName = 'dialogue';
    Dialogue.className = 'dialogue';
    Quill.register(General);
    Quill.register(Heading);
    Quill.register(Action);
    Quill.register(Character);
    Quill.register(Dialogue);
    Quill.register(Element);
    Quill.register(PageBreak);
    Quill.register(Parenthetical);
    Quill.register(Transition);
    Quill.register(Shot);
    Quill.register(Page);
  }
  script: Script = new Script();
  quill;
  // Initializes Quill - our WYSIWYG
  editorCreated( $event) {
    this.quill = $event;
  }
  // Import the proprietary XML file
  async importFDX( $event ) {
    const file = $event.target.files[0];
    this.script.scenes = await Script.importFDX( file );
    console.log( 'Abstracted Script ORIGINAL', this.script.scenes );
    const delta = await Script.toDelta( this.script.scenes );
    console.log('Script Deltas', delta);
    this.quill.setContents( delta );
  }
  async importModifiedFDX( $event ) {
    const file = $event.target.files[0];
    const scenes = await Script.importFDX( file );
    console.log( 'Abstracted Script VERSION 2', scenes );
    // INSERT CODE TO MERGE THE TWO SCRIPTS
  }

  mouseup( $event ) {
    if ( this.quill.getSelection().length > 0 ) {
      this.quill.format('element', Script.generateId());
    }
  }

  updateScript() {
    const delta = this.quill.getContents();
    console.log( 'Abstracted Script ANNOTATED', Script.importDelta( delta ) );
  }
}
